const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const activityService = require('../services/activityService');

exports.createTask = async (req, res) => {
  const { projectId } = req.params;
  const { title, description, priority, dueDate, assigneeId } = req.body;
  const actorId = req.user.id;
  if (!title) return res.status(400).json({ error: 'Title required' });
  try {
    // Ensure project exists
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority ?? 3,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assigneeId: assigneeId ?? null
      }
    });

    // create notification if assigned
    if (assigneeId) {
      await prisma.notification.create({
        data: {
          type: 'task_assigned',
          payload: { taskId: task.id, projectId },
          userId: assigneeId
        }
      });
    }

    activityService.log('task_created', { userId: actorId }, { taskId: task.id, projectId }, { title });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create task' });
  }
};

exports.getTasks = async (req, res) => {
  const { projectId } = req.params;
  const { status, assignee } = req.query;
  try {
    const where = { projectId };
    if (status) where.status = status;
    if (assignee) where.assigneeId = assignee;

    const tasks = await prisma.task.findMany({
      where,
      include: { assignee: { select: { id: true, name: true, email: true } }, comments: true }
    });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch tasks' });
  }
};

exports.getTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: { assignee: true, comments: { include: { author: true } }, project: true }
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const actorId = req.user.id;
  const { title, description, status, priority, dueDate, assigneeId } = req.body;
  try {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ error: 'Not found' });

    // if changing assignee or status, we will log and maybe notify
    const data = {
      title: title ?? task.title,
      description: description ?? task.description,
      status: status ?? task.status,
      priority: priority ?? task.priority,
      dueDate: dueDate ? new Date(dueDate) : task.dueDate,
      assigneeId: typeof assigneeId !== 'undefined' ? assigneeId : task.assigneeId,
      completedAt: (status === 'done' && !task.completedAt) ? new Date() : (status !== 'done' ? null : task.completedAt)
    };

    const updated = await prisma.task.update({ where: { id }, data });

    // If assignee changed, create notification
    if (assigneeId && assigneeId !== task.assigneeId) {
      await prisma.notification.create({
        data: {
          type: 'task_assigned',
          payload: { taskId: id, projectId: task.projectId },
          userId: assigneeId
        }
      });
      activityService.log('task_assigned', { userId: actorId }, { taskId: id }, { assigneeId });
    }

    if (status && status !== task.status) {
      activityService.log('task_status_changed', { userId: actorId }, { taskId: id }, { from: task.status, to: status });
    } else {
      activityService.log('task_updated', { userId: actorId }, { taskId: id }, {});
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update task' });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  const actorId = req.user.id;
  try {
    await prisma.comment.deleteMany({ where: { taskId: id } });
    await prisma.notification.deleteMany({ where: { payload: { path: ['taskId'], equals: id } } }).catch(() => {});
    await prisma.task.delete({ where: { id } });
    activityService.log('task_deleted', { userId: actorId }, { taskId: id }, {});
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete' });
  }
};
