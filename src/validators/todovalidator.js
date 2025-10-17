function validateCreate(payload) {
const errors = {};
if (!payload || typeof payload.title !== 'string' || payload.title.trim().length === 0) {
errors.title = 'title is required';
} else if (payload.title.length > 200) {
errors.title = 'title too long';
}
return Object.keys(errors).length ? { valid: false, errors } : { valid: true };
}


function validateUpdate(payload) {
const errors = {};
if (payload.title !== undefined) {
if (typeof payload.title !== 'string' || payload.title.trim().length === 0) {
errors.title = 'title must be non-empty string';
} else if (payload.title.length > 200) {
errors.title = 'title too long';
}
}
if (payload.completed !== undefined && typeof payload.completed !== 'boolean') {
errors.completed = 'completed must be boolean';
}
return Object.keys(errors).length ? { valid: false, errors } : { valid: true };
}


module.exports = { validateCreate, validateUpdate };