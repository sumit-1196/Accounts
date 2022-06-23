import { evaluate } from 'mathjs'

export function sentenceCase(str) {
    if ((str === null) || (str === ''))
        return false
    else
        str = str.toString()

    return str.replace(/\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() +
                txt.substr(1).toLowerCase()
        })
}

export function calculateExpression(str) {
    try {
        return evaluate(str).toFixed(0)
    } catch (e) {
        return str
    }
}