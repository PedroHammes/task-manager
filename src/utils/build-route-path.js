export function buildRoutePath(path) {
    // o path recebido é /tasks/:id

    // a constante abaixo vai identificar tudo que:
    // começa com ':'
    // tem letras de a-z
    // tem letras de A-Z
    // tem úmeros de 0 a 9
    // essas letras podem se repetir uma ou mais vezes
    const routeParametersRegex = /:([a-zA-Z0-9]+)/g
    // em replaceAll defino que todas as ocorrências de path que se encaixem em routeParametersRegex
    // serão substituídas por uma nova regex: ([a-z0-9_-]+)
    const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9_-]+)')

    const pathRegex = new RegExp(`^${pathWithParams}`)

    return pathRegex
}