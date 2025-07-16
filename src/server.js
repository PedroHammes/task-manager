import http from "node:http";
import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";


const PORT = 3333

const server = http.createServer( async ( req, res ) => {
    const {method, url} = req //desestrutura essas infos da req

    await json(req, res) // middleware comum a todas as requisições

    // Procura a rota requisitada no array de rotas
    const route = routes.find( (route) => route.method === method && route.path === url)

    if (route) {
        console.log('Rota encontradada! Executando o handler:')
        route.handler( req, res )
    } else {
        res.writeHead(404).end()
    }
} )

server.listen(PORT)

