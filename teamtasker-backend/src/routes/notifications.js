const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/notificationController');

router.use(auth);

router.get('/', ctrl.getNotifications);
router.put('/:id/read', ctrl.markRead);

module.exports = router;
