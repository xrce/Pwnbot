const color = require('./color')

module.exports = logprint = async (type, senderid, message) => {
    switch (type) {
        case '?': var col = 'yellow'; break
        case '$': var col = 'green'; break
        case '#': var col = 'red'; break
    }
    console.log(color(`${senderid}`, 'white'), color(type, col), message)
}