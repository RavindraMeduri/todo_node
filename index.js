const express = require('express');
const app = express();

const todoRouter = require('./routes/todo.route.js');
const errorHandler = require('./utils/error.utils');

app.use(express.json());

app.use('/api/todos',todoRouter);

app.use(errorHandler);

app.listen(3000);