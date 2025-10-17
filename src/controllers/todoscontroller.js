const service = require('../services/todoService');
const validator = require('../validators/todoValidator');


function parseBool(val) {
if (val === 'true') return true;
if (val === 'false') return false;
return undefined;
}


async function listTodos(req, res, next) {
try {
const completed = req.query.completed !== undefined ? parseBool(req.query.completed) : undefined;
const todos = service.list({ completed, q: req.query.q });
res.json(todos);
} catch (err) { next(err); }
}


async function getTodo(req, res, next) {
try {
const t = service.getById(req.params.id);
if (!t) return res.status(404).json({ error: 'NotFound', message: 'Todo not found' });
res.json(t);
} catch (err) { next(err); }
}


async function createTodo(req, res, next) {
  try {
    const v = validator.validateCreate(req.body);
    if (!v.valid) return res.status(400).json({ error: 'BadRequest', message: 'Validation failed', details: v.errors });

    const created = service.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    if (err.code === 'DUPLICATE') return res.status(400).json({ error: 'Duplicate title not allowed' });
    next(err);
  }
}


async function updateTodo(req, res, next) {
try {
const v = validator.validateUpdate(req.body);
if (!v.valid) return res.status(400).json({ error: 'BadRequest', message: 'Validation failed', details: v.errors });
const updated = service.update(req.params.id, req.body);
if (!updated) return res.status(404).json({ error: 'NotFound', message: 'Todo not found' });
res.json(updated);
} catch (err) { next(err); }
}


async function deleteTodo(req, res, next) {
try {
const ok = service.remove(req.params.id);
if (!ok) return res.status(404).json({ error: 'NotFound', message: 'Todo not found' });
res.status(204).send();
} catch (err) { next(err); }
}


module.exports = { listTodos, getTodo, createTodo, updateTodo, deleteTodo };