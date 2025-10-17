const express = require('express');
const bodyParser = require('body-parser');
const todosRouter = require('./routes/todos');
const { errorHandler } = require('./utils/errors'); 

const app = express();

app.use(bodyParser.json());
app.use('/todos', todosRouter);
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use(errorHandler);
const todos = [];
app.locals.todos = todos;

module.exports = app;
