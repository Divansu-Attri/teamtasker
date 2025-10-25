require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const connectMongo = require('../config/mongo');
const activityService = require('../services/activityService');

async function seed() {
  try {
    await connectMongo();
    console.log('Seeding...');

    // clear existing
    await prisma.notification.deleteMany().catch(()=>{});
    await prisma.comment.deleteMany().catch(()=>{});
    await prisma.task.deleteMany().catch(()=>{});
    await prisma.project.deleteMany().catch(()=>{});
    await prisma.user.deleteMany().catch(()=>{});

    const pwd = await bcrypt.hash('password', 10);
    const alice = await prisma.user.create({ data: { name: 'Alice', email: 'alice@test.com', passwordHash: pwd } });
    const bob = await prisma.user.create({ data: { name: 'Bob', email: 'bob@test.com', passwordHash: pwd } });
    const carol = await prisma.user.create({ data: { name: 'Carol', email: 'carol@test.com', passwordHash: pwd } });

    const p1 = await prisma.project.create({ data: { title: 'Website Revamp', description: 'Revamp landing pages', ownerId: alice.id } });
    const p2 = await prisma.project.create({ data: { title: 'Mobile App', description: 'MVP for mobile', ownerId: alice.id } });

    // tasks for p1
    for (let i = 1; i <= 6; i++) {
      const assignee = i % 2 === 0 ? bob.id : carol.id;
      const status = i <= 2 ? 'todo' : (i <=4 ? 'in_progress' : 'done');
      const t = await prisma.task.create({
        data: {
          title: `Task ${i} for ${p1.title}`,
          description: 'Auto-seeded task',
          status,
          priority: (i % 5) + 1,
          projectId: p1.id,
          assigneeId: assignee,
          dueDate: new Date(Date.now() + i * 24 * 60 * 60 * 1000)
        }
      });
      await prisma.comment.create({
        data: {
          text: `Seed comment for ${t.title}`,
          taskId: t.id,
          authorId: alice.id
        }
      });

      await prisma.notification.create({
        data: {
          type: 'task_assigned',
          payload: { taskId: t.id },
          userId: assignee
        }
      });

      activityService.log('task_created', { userId: alice.id }, { taskId: t.id, projectId: p1.id }, {});
    }

    console.log('✅ Seed complete');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed', err);
    process.exit(1);
  }
}

seed();
