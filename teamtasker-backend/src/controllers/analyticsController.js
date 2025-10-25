const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Activity = require('../mongoose/Activity');

exports.tasksPerDay = async (req, res) => {
  try {
    const today = new Date();
    const last7 = new Date(today);
    last7.setDate(today.getDate() - 6);

    const tasks = await prisma.task.findMany({
      where: {
        createdAt: { gte: last7 }
      },
      select: {
        createdAt: true
      }
    });

    // aggregate per day
    const counts = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(last7);
      d.setDate(last7.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      counts[key] = 0;
    }

    tasks.forEach(task => {
      const key = task.createdAt.toISOString().slice(0, 10);
      if (counts[key] !== undefined) counts[key]++;
    });

    res.json(counts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch tasks per day' });
  }
};

exports.topUsers = async (req, res) => {
  try {
    const doneTasks = await prisma.task.findMany({
      where: { status: 'done' },
      select: { assigneeId: true }
    });

    const counts = {};
    doneTasks.forEach(t => {
      if (!t.assigneeId) return;
      counts[t.assigneeId] = (counts[t.assigneeId] || 0) + 1;
    });

    const users = await prisma.user.findMany({
      where: { id: { in: Object.keys(counts) } },
      select: { id: true, name: true, email: true }
    });

    const result = users.map(u => ({ id: u.id, name: u.name, count: counts[u.id] }));
    result.sort((a, b) => b.count - a.count);

    res.json(result.slice(0, 5));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch top users' });
  }
};

exports.taskCountsByStatus = async (req, res) => {
  try {
    const tasks = await prisma.task.groupBy({
      by: ['status'],
      _count: { status: true }
    });

    const counts = {};
    tasks.forEach(t => { counts[t.status] = t._count.status });
    res.json(counts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch task counts' });
  }
};

exports.activityFeed = async (req, res) => {
  try {
    const logs = await Activity.find().sort({ createdAt: -1 }).limit(50);
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch activity feed' });
  }
};
