var router = require('express').Router();
var path = require('path');
var { getFileContent, writeFileContent } = require('../utils/file.utils.js');
const fileName = path.join(__dirname, '..', 'db', 'todo.db.json');

var { badRequest, internalServerError } = require('../utils/Error');

// function getNextId(cb) {
//     getFileContent(fileName, function (err, todos) {
//         if(err) cb(err, null);
//         return cb(null, todos.length == 0 ? 1 : todos[todos.length - 1].id + 1, todos);
//     });
// }

// function getNextId() {
//     return getFileContent(fileName)
//         .then(parsedData => {
//             return parsedData.length == 0 ? 1 : parsedData[parsedData.length - 1].id + 1;
//         })
//         .catch(err => {
//             console.log(err);
//         });
// }

async function getNextId() {
    var parsedData = await getFileContent(fileName);
    return (parsedData.length == 0) ? 1 : parsedData[parsedData.length - 1].id + 1;
}

// router.get('/', function (req, res) {
   
//     getFileContent(fileName, function (err, todos) {
//         if (err) throw err;
//         res.json(todos);
//     });
// });

// router.get('/', function (req, res) {
//     getFileContent(fileName)
//         .then(data => res.json(data))
//         .catch(err => {
//             console.log(err);
//         });
// });

router.get('/', async function (req, res, next) {
    try {
        var todos = await getFileContent(fileName);
        return res.json(todos);
    }
    catch(err) {
        next(internalServerError.getError('Something went wrong'));
    }
});

// router.post('/', function (req, res) {
//     getNextId(function (err, id, todos) {
//         if (err) throw err;
//         var todo = {...req.body, id : id};
//         todos.push(todo);
//         writeFileContent(fileName, todos, function (err, data) {
//             if (err) throw err;
//             res.send(todo);
//         });
//     });
   
// });

// router.post('/', function (req, res) {
//     var _id;
//     getNextId()
//         .then(id => (_id = id))
//         .then(_ => getFileContent(fileName))
//         .then(todos => {
//             var todo = {...req.body, id : _id};
//             todos.push(todo);
//             return writeFileContent(fileName, todos)
//         })
//         .then(data => res.json(data))
//         .catch(err => {
//             console.log(err);
//         });

// });

router.post('/', async function (req, res, next) {
    try {
        var id = await getNextId();
        var todos = await getFileContent(fileName);
        var todo = { ...req.body, id : id };
        todos.push(todo);
        var data = await writeFileContent(fileName, todos);
        return res.json(data);
    }
    catch(err) {
        next(err);
    }
});

// using callbacks

// router.put('/:id', function (req, res) {

//     var { id } = req.params;
//     var updatedTodo = req.body;
    
//     getFileContent(fileName, function (err, todos) {
//         if (err) throw err;
//         var idx = todos.findIndex(t => t.id == id);
//         if(idx != -1) {
//             todos[idx] = {...updatedTodo, id : id};
//             return writeFileContent(fileName, todos, function (err) {
//                 if (err) throw err;
//                 return res.send({...updatedTodo, id : id});
//             });
        
//         }

//         return res.json({
//             msg : 'Todo with the specified id does not exist'
//         });
//     });

// });

// using promises

// router.put('/:id', function (req, res) {
//     var { id } = req.params;
//     var updatedTodo = req.body;

//     var _todos;
//     var _idx;
//     getFileContent(fileName)
//         .then(todos => (_todos = todos))
//         .then(todos => (todos.findIndex(todo => todo.id == id)))
//         .then(idx => (_idx = idx))
//         .then(idx => (idx != -1))
//         .then(isPresent => {
//             if(isPresent) {
//                 _todos[_idx] = {...updatedTodo, id : id};
//                 return writeFileContent(fileName, _todos);
//             }

//             return {
//                 msg : 'Todo with the specified id does not exist'
//             };
//         })
//         .then(data => res.json(data))
//         .catch(err => {
//             console.log(err);
//         })
// });

router.put('/:id', async function (req, res, next) {
    try {
        var { id } = req.params;
        var updatedTodo = req.body;

        var todos = await getFileContent(fileName);
        var idx = todos.findIndex(todo => todo.id == id);
        if(idx != -1) {
            todos[idx] = { ...updatedTodo, id : id };
            var data = await writeFileContent(fileName, todos);
            return res.json(data);
        }

        next(badRequest.getError('Todo with the specified id does not exist'));
    }
    catch(err) {
        next(err);
    }
});

// router.patch('/:id', function (req, res) {
//     var { id } = req.params;
//     var updatedTodo = req.body;
//     getFileContent(fileName, function (err, todos) {
//         if (err) throw err;
//         var idx = todos.findIndex(t  => t.id == id);
//         if(idx != -1) {
//             todos[idx] = {...todos[idx], ...updatedTodo, id : id};
//             return writeFileContent(fileName, todos, function (err) {
//                 if (err) throw err;
//                 return res.json({...todos[idx], ...updatedTodo, id : id});
//             });
        
//         }

//         return res.json({
//             msg : 'Todo with the specified id does not exist'
//         });
//     });
    
// });

// Using promises

// router.patch('/:id', function (req, res) {
//     var { id } = req.params;
//     var updatedTodo = req.body;

//     var _idx;
//     var _todos;
//     getFileContent(fileName)
//         .then(todos => (_todos = todos))
//         .then(todos => (todos.findIndex(todo => todo.id == id)))
//         .then(idx => (_idx = idx))
//         .then(idx => (idx != -1))
//         .then(isPresent => {

//             if(isPresent) {
//                 _todos[_idx] = {..._todos[_idx], ...updatedTodo, id : id};
//                 return writeFileContent(fileName, _todos);
//             }

//             return {
//                 msg : 'Todo with the specified id does not exist'
//             };
//         })
//         .then(data => res.json(data))
//         .catch(err => {
//             console.log(err);
//         });
// });


router.patch('/:id', async function (req, res, next) {
    try {
        var { id } = req.params;
        var updatedTodo = req.body;

        var todos = await getFileContent(fileName);
        var idx = todos.findIndex(todo => todo.id == id);
        if(idx != -1) {
            todos[idx] = { ...todos[idx], ...updatedTodo, id : id };
            var data = await writeFileContent(fileName, todos);
            return res.json(data);
        }

        next(badRequest.getError('Todo with the specified id does not exist'));
    }
    catch(err) {
        next(err);
    }
}); 

// using promises

// router.delete('/:id', function (req, res) {

//     var { id } = req.params;

//     // getFileContent(fileName, function (err, todos) {
//     //     if (err) throw err;
//     //     todos = todos.filter(t => t.id != id);
//     //     return writeFileContent(fileName, todos, function (err) {
//     //         if (err) throw err;
//     //         res.json({});
//     //     });
//     // });

//     getFileContent(fileName)
//         .then(todos => todos.filter(todo => todo.id != id))
//         .then(newTodos => writeFileContent(fileName, newTodos))
//         .then(_ => res.json({}))
//         .catch(err => {
//             console.log(err);
//         });

    
// });

router.delete('/:id', async function (req, res, next) {
    try {
        var { id } = req.params;
        var todos = await getFileContent(fileName);
        var newTodos = todos.filter(todo => todo.id != id);
        if(todos.length == newTodos.length) {
            next(badRequest.getError('No Todo is present'));
        }
        await writeFileContent(fileName, newTodos);
        return res.json({});
    }
    catch(err) {
        next(internalServerError.getError('Something went wrong'));
    }
});

module.exports = router;