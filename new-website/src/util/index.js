export function takeFirst(arr) {
    return arr.length > 0 ? arr[0] : null
}
export function getGraphQlNode(edge) {
    return edge?.node
}
export function filterForNeedle(needle, key) {
    return haystack => {
        const haystackValue = haystack[key]
        if (haystackValue && haystackValue === needle) {
            return haystack
        }
        return undefined
    }
}
