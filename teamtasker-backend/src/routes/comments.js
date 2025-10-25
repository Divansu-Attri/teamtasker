const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/commentController');

router.use(auth);

router.post('/task/:taskId', ctrl.addComment);
router.get('/task/:taskId', ctrl.getComments);

module.exports = router;
