const express = require('express');
const app = express();

const todoRouter = require('./routes/todo.route.js');

app.use(express.json());

app.use('/api/todos',todoRouter);



app.listen(3000);