export class Database {
    #database = {}

    insert(table, data) {
        
        // Se a tabela existe adiciona os dados à ela
        if ( Array.isArray(this.#database[table]) ) {
            this.#database[table].push(data)

        // Se não existe cria e então adicona os dados
        } else {
            this.#database[table] = [data]
        }
    }

    select(table) {
        const data = this.#database[table] ?? "Tabela não encontrada"
        return data
    }
}