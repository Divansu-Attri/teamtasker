const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/projectController');

router.use(auth);

router.post('/', ctrl.createProject);
router.get('/', ctrl.getProjects);
router.get('/:id', ctrl.getProject);
router.put('/:id', ctrl.updateProject);
router.delete('/:id', ctrl.deleteProject);

module.exports = router;
