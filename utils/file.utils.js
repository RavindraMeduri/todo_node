const fs = require('fs').promises;

exports.getFileContent = function(fileName) {
    // fs.readFile(fileName, function (err, data) {
    //     if(err) return cb(err, null);
    //     return cb(null, JSON.parse(data.toString()));
    // });

    return fs.readFile(fileName)
        .then(data => JSON.parse(data.toString()))
        .catch(err => {
            console.log(err);
        });
}

exports.writeFileContent = function(fileName, data) {
    // fs.writeFile(fileName, JSON.stringify(data), function (err, data) {
    //     if(err) return cb(err, null);
    //     return cb(null);
    // });

    fs.writeFile(fileName, JSON.stringify(data))
        .then(_ => 'created')
        .catch(err => {
            console.log(err);
        });
}

