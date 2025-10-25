const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/analyticsController');

router.use(auth);

router.get('/tasks-per-day', ctrl.tasksPerDay);
router.get('/top-users', ctrl.topUsers);
router.get('/tasks-by-status', ctrl.taskCountsByStatus);
router.get('/activity-feed', ctrl.activityFeed);

module.exports = router;
