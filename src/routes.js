import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: ( req, res ) => {
            return res.end(JSON.stringify(database.select("tasks")))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks/import'),
        handler: ( req, res ) => {
            database.import( )
            return res.end('Importação iniciada')
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
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
            path: buildRoutePath('/tasks/:id'),
            handler: ( req, res ) => {
                const { id } = req.params
                const { title, description, updated_at, completed_at} = req.body
                const data = {
                    title,
                    description,
                    updated_at,
                    completed_at
                }
                database.update("tasks", id, data)
                return res.end('Tarefa atualizada!') 
            }
        },
        {
            method: 'DELETE',
            path: buildRoutePath('/tasks/:id'),
            handler: ( req, res ) => {
                const { id } = req.params
                database.delete("tasks", id)
                return res.writeHead(204).end()
            }
        },
        {
            method: 'PATCH',
            path: buildRoutePath('/tasks/:id'),
            handler: ( req, res ) => {
                const { id } = req.params
                database.complete("tasks", id)
                return res.end('Tarefa concluída!') 
            }
        }

]

