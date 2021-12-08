module.exports = (array) => {
    const list = []
    for (let i = 0; i < array.length; i++) {
        list.push(`• ${array[i]}`)
    }
    return list.join('\n')
}
