const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const activityService = require('../services/activityService');

exports.getNotifications = async (req, res) => {
  const userId = req.user.id;
  try {
    const notifs = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    res.json(notifs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch notifications' });
  }
};

exports.markRead = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const notif = await prisma.notification.findUnique({ where: { id } });
    if (!notif || notif.userId !== userId) return res.status(404).json({ error: 'Not found' });
    const updated = await prisma.notification.update({ where: { id }, data: { read: true } });
    activityService.log('notification_read', { userId }, { notificationId: id }, {});
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not mark read' });
  }
};
