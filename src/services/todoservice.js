const { v4: uuidv4 } = require('uuid');

const todos = new Map();

function create({ title, description }) {

  const duplicate = Array.from(todos.values()).find(
    t => t.title.toLowerCase() === title.toLowerCase()
  );
  if (duplicate) {
    const err = new Error('Duplicate title');
    err.code = 'DUPLICATE';
    throw err;
  }

  const id = uuidv4();
  const now = new Date().toISOString();
  const todo = { id, title, description: description || '', completed: false, createdAt: now, updatedAt: now };
  todos.set(id, todo);
  return todo;
}

function list({ completed, q } = {}) {
  let arr = Array.from(todos.values());
  if (typeof completed === 'boolean') arr = arr.filter(t => t.completed === completed);
  if (q) {
    const s = q.toLowerCase();
    arr = arr.filter(t => (t.title + ' ' + (t.description || '')).toLowerCase().includes(s));
  }
  return arr;
}

function getById(id) {
  return todos.get(id) || null;
}

function update(id, patch) {
  const todo = todos.get(id);
  if (!todo) return null;

  if (patch.title) {
    const duplicate = Array.from(todos.values()).find(
      t => t.title.toLowerCase() === patch.title.toLowerCase() && t.id !== id
    );
    if (duplicate) {
      const err = new Error('Duplicate title');
      err.code = 'DUPLICATE';
      throw err;
    }
  }

  const updated = { ...todo, ...patch, updatedAt: new Date().toISOString() };
  todos.set(id, updated);
  return updated;
}

function remove(id) {
  return todos.delete(id);
}

function clearAll() {
  todos.clear();
}

module.exports = { create, list, getById, update, remove, clearAll };
