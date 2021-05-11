const router = require('express').Router();
const path = require('path');
var { getFileContent, writeFileContent } = require('../utils/file.utils.js');
var fileName = path.join(__dirname, '..', 'db', 'todo.db.json');

function getNextId(cb) {
    getFileContent(fileName, function (err, todos) {
        if(err) cb(err, null);
        return cb(null, todos.length == 0 ? 1 : todos[todos.length - 1].id + 1, todos);
    });
}

router.get('/', function (req, res) {
   
    getFileContent(fileName, function (err, todos) {
        if (err) throw err;
        res.json(todos);
    });
});

router.post('/', function (req, res) {
    getNextId(function (err, id, todos) {
        if (err) throw err;
        var todo = {...req.body, id : id};
        todos.push(todo);
        writeFileContent(fileName, todos, function (err, data) {
            if (err) throw err;
            res.send(todo);
        });
    });
   
});

router.put('/:id', function (req, res) {

    var { id } = req.params;
    var updatedTodo = req.body;
    
    getFileContent(fileName, function (err, todos) {
        if (err) throw err;
        var idx = todos.findIndex(t => t.id == id);
        if(idx != -1) {
            todos[idx] = {...updatedTodo, id : id};
            return writeFileContent(fileName, todos, function (err) {
                if (err) throw err;
                return res.send({...updatedTodo, id : id});
            });
        
        }

        return res.json({
            msg : 'Todo with the specified id does not exist'
        });
    });

});

router.patch('/:id', function (req, res) {
    var { id } = req.params;
    var updatedTodo = req.body;
    getFileContent(fileName, function (err, todos) {
        if (err) throw err;
        var idx = todos.findIndex(t  => t.id == id);
        if(idx != -1) {
            todos[idx] = {...todos[idx], ...updatedTodo, id : id};
            return writeFileContent(fileName, todos, function (err) {
                if (err) throw err;
                return res.json({...todos[idx], ...updatedTodo, id : id});
            });
        
        }

        return res.json({
            msg : 'Todo with the specified id does not exist'
        });
    });
    
});

router.delete('/:id', function (req, res) {

    var { id } = req.params;

    getFileContent(fileName, function (err, todos) {
        if (err) throw err;
        todos = todos.filter(t => t.id != id);
        return writeFileContent(fileName, todos, function (err) {
            if (err) throw err;
            res.json({});
        });
    });
    
});

module.exports = router;