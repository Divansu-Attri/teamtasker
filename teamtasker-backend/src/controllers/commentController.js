const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const activityService = require('../services/activityService');

exports.addComment = async (req, res) => {
  const { taskId } = req.params;
  const { text } = req.body;
  const authorId = req.user.id;
  if (!text) return res.status(400).json({ error: 'Text required' });
  try {
    // confirm task exists
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const comment = await prisma.comment.create({
      data: { text, taskId, authorId },
      include: { author: { select: { id: true, name: true } } }
    });

    activityService.log('comment_created', { userId: authorId }, { taskId }, { commentId: comment.id, text: text.slice(0, 200) });

    // notify assignee if exists and not author
    if (task.assigneeId && task.assigneeId !== authorId) {
      await prisma.notification.create({
        data: {
          type: 'task_commented',
          payload: { taskId, commentId: comment.id },
          userId: task.assigneeId
        }
      });
    }

    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not add comment' });
  }
};

exports.getComments = async (req, res) => {
  const { taskId } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { taskId },
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'asc' }
    });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch comments' });
  }
};
