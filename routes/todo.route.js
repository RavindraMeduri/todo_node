const router = require('express').Router();

var todos = [];

function getNextId() {
    return todos.length == 0 ? 1 : todos[todos.length - 1].id + 1;
}

router.get('/', function (req, res) {
    res.json(todos);
});

router.post('/', function (req, res) {
    var id = getNextId();
    var todo = {...req.body, id : id};
    todos.push(todo);
    res.send(todo);
});

router.put('/:id', function (req, res) {
    var { id } = req.params;
    var updatedTodo = req.body;
    var idx = todos.findIndex(t => t.id == id);
    if(idx != -1) {
        todos[idx] = {...updatedTodo, id : id};
        return res.send({...updatedTodo, id : id});
    }

    return json({
        msg : 'Todo with the specified id does not exist'
    });
});

router.patch('/:id', function (req, res) {
    var { id } = req.params;
    var updatedTodo = req.body;
    var idx = todos.findIndex(t  => t.id == id);
    if(idx != -1) {
        todos[idx] = {...todos[idx], ...updatedTodo, id : id};
        return res.send({...todos[idx], ...updatedTodo, id : id});
    }

    return json({
        msg : 'Todo with the specified id does not exist'
    });
});

router.delete('/:id', function (req, res) {
    var { id } = req.params;
    todos = todos.filter(t => t.id != id);
    res.json(todos);
});

module.exports = router;