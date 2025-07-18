import fs from "node:fs/promises"
import { createReadStream } from "node:fs"
import { parse } from "csv-parse"
import { randomUUID } from "node:crypto"
import { extractQueryParams } from "./utils/extractQueryParams.js"
import { title } from "node:process"

// O arquivo precisa ser encontrado não impora de onde o programa esteja sendo executado:
const databasePath = new URL('../db.json', import.meta.url)
const CSVpath = new URL('./tasks.csv', import.meta.url)

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
        const new_task = {
            id: randomUUID(),
            title: data.title,
            description: data.description,
            created_at: new Date(),
            updated_at: null,
            completed_at: null
        }
        // Se a tabela existe adiciona os dados à ela
        if ( Array.isArray(this.#database[table]) ) {
            this.#database[table].push(new_task)

        // Se não existe cria e então adicona os dados
        } else {
            this.#database[table] = [new_task]
        }

        this.#persist()
    }

    select(table, url) {
        const data = this.#database[table] ?? "Tabela não encontrada"

        // Divie a url na ocorrência do '?' que indica o início dos queryparams
        const have_params = url.split("?") 
        
        if (have_params.length > 1) {
            console.log('Retornando busca com parâmetros')
            
            // Seleciona apenas os params
            const query_params = new URLSearchParams(have_params[1])

            const search_result = this.#database[table].filter( (task) => {
                return query_params.has('title') && query_params.has('description')
                ? task.title.includes(query_params.get('title')) && task.description.includes(query_params.get('description'))
                : query_params.has('title')
                    ? task.title.includes(query_params.get('title'))
                    : query_params.has('description')
                        ? task.description.includes(query_params.get('description'))
                        : false
            })

            return search_result

        }  else {
            console.log('Retornando busca sem parâmetros')
            return data
        }
    }

    delete(table, id) {
        // Procura o ídice da tarefa que tem o mesmo ID da que está sendo buscada
        const task_index = this.#database[table].findIndex( (task) => task.id === id )

        // findIndex() retorna a posição do elemento encontrado (de 0 à length-1)
        //  ou -1 caso não encontre o elemento.
        if (task_index > -1) {
            this.#database[table].splice(task_index, 1) 
            this.#persist()
        } else {
            throw new Error('Não foi possível encontrar uma tarefa com este ID.')
        }
    }

    update(table, id, data) {
        // Procura o ídice da tarefa que tem o mesmo ID da que está sendo buscada
        const task_index = this.#database[table].findIndex( (task) => task.id === id)

        // Se a tarefa foi encontrada, atualiza ela
        if (task_index > -1) {

            // Informa a data que foi atualizada
            data.updated_at = new Date()

            // Filtra somente os valores que foram modificados
            const filteredData = Object.fromEntries(
                Object.entries(data).filter( ([ , value]) => value !== undefined)
            )

            // Insere os valores atualizados mantendo os que não foram.
            this.#database[table][task_index] = {
                ...this.#database[table][task_index],
                ...filteredData
            }

            // Salva as alterações
            this.#persist()
            
        } else {
            throw new Error('Não foi possível encontrar uma tarefa com este ID.')
        }

    }

    complete(table, id) {
        
        // Procura o índice da tarefa
        const task_index = this.#database[table].findIndex( (task) => task.id === id)

        // Se a tarefa foi encontrada, atualiza a data de conclusão
        if (task_index > -1) {
            this.#database[table][task_index].completed_at = this.#database[table][task_index].completed_at === null ? new Date() : null
        } else {
            throw new Error('Não foi possível encontrar uma tarefa com este ID.')
        }

        // Salva as alterações no BD
        this.#persist()
    }

    async import() {

        // Este bloco trycatch é a stream que lê o arquivo
        try {
            // Using createReadStream instead readFile because is better to big files (read chunk by chunk)
            const tasks_csv = createReadStream(CSVpath).pipe(parse({
                // parse é um método interno da biblioteca csv-parse
                // seus atributos tem muitas funções: (pesquise headers e delimitadores de parse csv nodejs)
                delimiter: ",", // define o caracter que separa os valores de cada linha
                columns: true // define se a primeira linha do CSV deve ser usada como cabeçalho
            })) 


            // wait for all the pieces to be read
            for await (const chunk of tasks_csv) {
                try {
                    this.insert('tasks', chunk)
                } catch (error) {
                    console.error(`Erro ao inserir tarefa (${chunk.title}):${error.message}`)
                }
                // console.log('Recebido pedaço:', chunk)
            }

        } catch (error) {
            console.error('Erro durante a leitura:', error)

        }
        this.#persist()
    }

}