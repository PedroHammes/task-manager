export async function json(params) {
    const buffers = [] // armazena os pedacinhos da req
    
    // junta todos os pedacinhos da requisição dentro do array
    for await (const chunk of req) {
        buffers.push(chunk)
    }
    
    try {
        // transforma os pedacinhos da req em uma string única
        // usaremos esta string como o corpo da requisição
        req.body = JSON.parse(Buffer.concat(buffers).toString())
    } catch (error) {
        req.body = null
    }
    
    return res
    .setHeader('Content-type', 'application/json')
}