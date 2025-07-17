import fs from "node:fs/promises"

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
    #database = {}
    
    constructor() {
        fs.readFile(databasePath, 'utf8')
        .then(data => this.#database = JSON.parse(data))
        .catch(() => this.#persist())
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    insert(table, data) {
        
        // Se a tabela existe adiciona os dados à ela
        if ( Array.isArray(this.#database[table]) ) {
            this.#database[table].push(data)

        // Se não existe cria e então adicona os dados
        } else {
            this.#database[table] = [data]
        }

        this.#persist()
    }

    select(table) {
        const data = this.#database[table] ?? "Tabela não encontrada"
        return data
    }

    delete(table, id) {
        // Procura o ídice da tarefa que tem o mesmo ID da que está sendo buscada
        const task_index = this.#database[table].findIndex( (task) => task.id === id )

        // findIndex() retorna a posição do elemento encontrado (de 0 à length-1)
        //  ou -1 caso não encontre o elemento.
        if (task_index > -1) {
            this.#database[table].splice(task_index, 1) 
            this.#persist()  
        }
        this.#persist()
    }

        update(table, id, data) {
        // Procura o ídice da tarefa que tem o mesmo ID da que está sendo buscada
        const task_index = this.#database[table].findIndex( (task) => task.id === id)

        // Se a tarefa foi encontrada, atualiza ela
        if (task_index > -1) {

            const filteredData = Object.fromEntries(
                Object.entries(data).filter( ([ , value]) => value !== undefined)
            )

            filteredData.updated_at = new Date()

            this.#database[table][task_index] = {
                ...this.#database[table][task_index],
                ...filteredData
            }
            this.#persist()
        }

    }

    complete(table, id) {
        
        // Procura o índice da tarefa
        const task_index = this.#database[table].findIndex( (task) => task.id === id)

        // Se a tarefa foi encontrada, atualiza a data de conclusão
        if (task_index > -1) {
            this.#database[table][task_index].completed_at = new Date()
        }

        // Salva as alterações no BD
        this.#persist()
    }

}