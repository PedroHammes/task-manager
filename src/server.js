import http from "node:http";
import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";


const PORT = 3333

const server = http.createServer( async ( req, res ) => {
    const {method, url} = req //desestrutura essas infos da req

    await json(req, res) // middleware comum a todas as requisições

    // Procura a rota requisitada no array de rotas
    const route = routes.find( route => {
        return route.method === method && route.path.test(url)
    })

    if (route) {
        const routeParams = req.url.match(route.path)
        req.params = { ...routeParams.groups} ?? {} // se não existir parâmetro na rota não dará erro.
        route.handler( req, res )
    } else {
        res.writeHead(404).end()
    }


} )

server.listen(PORT)

