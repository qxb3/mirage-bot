const fs = require('fs')

module.exports = (path) => {
    const file = fs.readFileSync(process.env.PWD + '/' + path)
    return JSON.parse(Buffer.from(file))
}
