import http from "node:http";

const PORT = 3333
const server = http.createServer( ( req, res ) => {
    res.end('A simple and local task manager')
} )
server.listen(PORT)

