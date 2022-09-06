const fs = require('fs')

module.exports = refile = async (sender, from, to) => {
    fs.unlink(`temp/from-${sender}.txt`, function (err) {
        if (err) {
        }
    });
    fs.unlink(`temp/to-${sender}.txt`, function (err) {
        if (err) {
        }
    });
    fs.appendFile(`temp/from-${sender}.txt`, `${from}`, err => {
        if (err) {
            console.error(err)
            return
        }
    });
    fs.appendFile(`temp/to-${sender}.txt`, `${to}`, err => {
        if (err) {
            console.error(err)
            return
        }
    });
}