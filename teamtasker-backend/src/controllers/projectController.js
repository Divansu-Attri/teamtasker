const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const activityService = require('../services/activityService');

exports.createProject = async (req, res) => {
  const { title, description } = req.body;
  const ownerId = req.user.id;
  if (!title) return res.status(400).json({ error: 'Title required' });
  try {
    const project = await prisma.project.create({
      data: { title, description, ownerId }
    });
    activityService.log('project_created', { userId: ownerId }, { projectId: project.id }, { title });
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create project' });
  }
};

exports.getProjects = async (req, res) => {
  const userId = req.user.id;
  try {
    // list projects owned by user (could later add membership)
    const projects = await prisma.project.findMany({
      where: { ownerId: userId },
      include: { tasks: { take: 10 } }
    });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch projects' });
  }
};

exports.getProject = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { tasks: true, owner: { select: { id: true, name: true, email: true } } }
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { title, description } = req.body;
  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return res.status(404).json({ error: 'Not found' });
    if (project.ownerId !== userId) return res.status(403).json({ error: 'Forbidden' });

    const updated = await prisma.project.update({
      where: { id },
      data: { title: title ?? project.title, description: description ?? project.description }
    });
    activityService.log('project_updated', { userId }, { projectId: id }, {});
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update' });
  }
};

exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Check if project exists
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return res.status(404).json({ error: 'Not found' });

    // Check ownership
    if (project.ownerId !== userId) return res.status(403).json({ error: 'Forbidden' });

    // Delete comments, tasks, and project in a single transaction
    await prisma.$transaction([
      prisma.comment.deleteMany({
        where: {
          task: {
            projectId: id,
          },
        },
      }),
      prisma.task.deleteMany({ where: { projectId: id } }),
      prisma.project.delete({ where: { id } }),
    ]);

    // Log activity
    activityService.log('project_deleted', { userId }, { projectId: id }, {});

    res.json({ ok: true });
  } catch (err) {
    console.error(err);

    // Handle potential foreign key issues gracefully
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Resource not found for deletion' });
    }

    res.status(500).json({ error: 'Could not delete' });
  }
};
