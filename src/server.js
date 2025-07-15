import http from "node:http";
import { randomUUID } from "node:crypto";

const tasks = []

const PORT = 3333
const server = http.createServer( async ( req, res ) => {
    const {method, url} = req //desestrutura essas infos da req
    

    if ( method === 'GET' && url === '/tasks') {
        return res
            .setHeader('Content-type', 'application/json')
            .end(JSON.stringify(tasks))          
    }

    if ( method === 'POST' && url === '/tasks') {
        const { title, description } = req.body
        
        const new_task = {
            id: randomUUID(),
            title: title,
            description: description,
            created_at: new Date(),
            updated_at: null,
            completed_at: null
        }

        tasks.push(new_task)
        return res.writeHead(201).end()
    }

    if ( method === 'PUT' && url === '/tasks') {
        return res.end('Tarefa atualizada!')    
    }
    
    if ( method === 'DELETE' && url === '/tasks') {
        return res.end('Tarefa excluída!')    
    }

    res.writeHead(404).end()
} )
server.listen(PORT)

