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
                
                if (!title || !description) {
                    return res.writeHead(400).end("Infome title e description")
                }

                const data = {
                    title: title,
                    description: description
                }

                database.insert("tasks", data)
                return res.writeHead(201).end()
            }
    },
    
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: ( req, res ) => {
            const { id } = req.params
            const { title, description} = req.body
            const data = {
                title,
                description,
            }

            if (!title && !description) {
                return res.writeHead(404).end("Infome title e description")
            }

            try {
                database.update("tasks", id, data)
            } catch (error) {
                return res.writeHead(404).end(error.message)
            }

            return res.end('Tarefa atualizada!') 
        }
    },

    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: ( req, res ) => {
            const { id } = req.params

            try {
                database.delete("tasks", id)
            } catch (error) {
                return res.writeHead(404).end(error.message)
            }

            return res.writeHead(204).end()
        }
    },

    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: ( req, res ) => {
            const { id } = req.params

            try {
                database.complete("tasks", id)
            } catch (error) {
                return res.writeHead(404).end(error.message)
            }

            return res.writeHead(200).end('Status da tarefa alterado!') 
        }
    }

]

