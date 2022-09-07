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
        if (err) throw err;
    });
    fs.appendFile(`temp/to-${sender}.txt`, `${to}`, err => {
        if (err) throw err;
    });
}