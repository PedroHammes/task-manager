import { Database } from "./database.js";
import { randomUUID } from "node:crypto";

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: '/tasks',
        handler: ( req, res ) => {
            return res.end(JSON.stringify(database.select("tasks")))
        }
    },
    {
        method: 'POST',
        path: '/tasks',
        handler: ( req, res ) => {
                const { title, description } = req.body
                
                const new_task = {
                    id: randomUUID(),
                    title: title,
                    description: description,
                    created_at: new Date(),
                    updated_at: null,
                    completed_at: null
                }

                database.insert("tasks", new_task)
                return res.writeHead(201).end()
            }
        },
        {
            method: 'PUT',
            path: '/tasks',
            handler: ( req, res ) => {
                return res.end('Tarefa atualizada!') 
            }
        },
        {
            method: 'DELETE',
            path: '/tasks',
            handler: ( req, res ) => {
                return res.end('Tarefa excluída!')     
            }
        },

]

