const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/taskController');

router.use(auth);

// tasks under project
router.post('/project/:projectId', ctrl.createTask);
router.get('/project/:projectId', ctrl.getTasks);

// single task
router.get('/:id', ctrl.getTask);
router.put('/:id', ctrl.updateTask);
router.delete('/:id', ctrl.deleteTask);

module.exports = router;
