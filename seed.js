require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connect } = require('./db/connection');

(async () => {
  const db = await connect();

  await db.collection('users').deleteMany({});
  await db.collection('projects').deleteMany({});
  await db.collection('tasks').deleteMany({});
  await db.collection('notes').deleteMany({});

  await db.collection('users').createIndex({ email: 1 }, { unique: true });

  const hash1 = await bcrypt.hash('zoha1234', 10);
  const hash2 = await bcrypt.hash('rabia1234', 10);

  const u1 = await db.collection('users').insertOne({
    name: 'zoha',
    email: 'zoha@gmail.com',
    passwordHash: hash1,
    createdAt: new Date('2024-01-10')
  });

  const u2 = await db.collection('users').insertOne({
    name: 'rabia',
    email: 'rabia@gmail.com',
    passwordHash: hash2,
    createdAt: new Date('2024-02-05')
  });

  const zohaId = u1.insertedId;
  const rabiaId   = u2.insertedId;

  const p1 = await db.collection('projects').insertOne({
    ownerId: zohaId,
    name: 'Final Year Project',
    description: 'Research and implementation of ML pipeline',
    archived: false,
    createdAt: new Date('2024-01-15')
  });

  const p2 = await db.collection('projects').insertOne({
    ownerId: zohaId,
    name: 'Personal Website',
    description: 'Portfolio site redesign',
    archived: false,
    createdAt: new Date('2024-02-01')
  });

  const p3 = await db.collection('projects').insertOne({
    ownerId: rabiaId,
    name: 'Mobile App',
    description: 'cross-platform task manager app',
    archived: false,
    createdAt: new Date('2024-02-10')
  });

  const p4 = await db.collection('projects').insertOne({
    ownerId: rabiaId,
    name: 'Old Blog',
    description: 'Archived blog project',
    archived: true,
    createdAt: new Date('2023-06-01')
  });

  const p1Id = p1.insertedId;
  const p2Id = p2.insertedId;
  const p3Id = p3.insertedId;

  await db.collection('tasks').insertMany([
    {
      ownerId: zohaId,
      projectId: p1Id,
      title: 'Write literature review',
      status: 'done',
      priority: 3,
      tags: ['writing', 'research'],
      subtasks: [
        { title: 'Find 10 papers', done: true },
        { title: 'Summarise each paper', done: true }
      ],
      dueDate: new Date('2024-03-01'),
      createdAt: new Date('2024-01-20')
    },
    {
      ownerId: zohaId,
      projectId: p1Id,
      title: 'Build data pipeline',
      status: 'in-progress',
      priority: 5,
      tags: ['coding', 'urgent'],
      subtasks: [
        { title: 'Set up Python environment', done: true },
        { title: 'Write  script', done: false },
        { title: 'Test with sample data', done: false }
      ],
      dueDate: new Date('2024-04-15'),
      createdAt: new Date('2024-02-05')
    },
    {
      ownerId: zohaId,
      projectId: p2Id,
      title: 'Design homepage mockup',
      status: 'todo',
      priority: 2,
      tags: ['design'],
      subtasks: [
        { title: 'Sketch wireframe', done: false },
        { title: 'Choose color palette', done: false }
      ],
      createdAt: new Date('2024-02-10')
    },
    {
      ownerId: rabiaId,
      projectId: p3Id,
      title: 'Set up React Native project',
      status: 'done',
      priority: 4,
      tags: ['coding', 'setup'],
      subtasks: [
        { title: 'Install dependencies', done: true },
        { title: 'Configure navigation', done: true }
      ],
      createdAt: new Date('2024-02-12')
    },
    {
      ownerId: rabiaId,
      projectId: p3Id,
      title: 'Implement user authentication',
      status: 'in-progress',
      priority: 5,
      tags: ['coding', 'security'],
      subtasks: [
        { title: 'JWT setup', done: true },
        { title: 'Login screen UI', done: false },
        { title: 'Register screen UI', done: false }
      ],
      dueDate: new Date('2024-05-01'),
      createdAt: new Date('2024-02-20')
    },
    {
      ownerId: zohaId,
      projectId: p1Id,
      title: 'Write project report',
      status: 'todo',
      priority: 4,
      tags: ['writing', ],
      subtasks: [
        { title: 'Draft introduction', done: false },
        { title: 'Draft methodology', done: false },
        { title: 'Draft conclusion', done: false }
      ],
      createdAt: new Date('2024-03-01')
    },
    {
      ownerId: rabiaId,
      projectId: p3Id,
      title: 'Design app icon',
      status: 'todo',
      priority: 1,
      tags: ['design'],
      subtasks: [],
      createdAt: new Date('2024-03-05')
    }
  ]);

  await db.collection('notes').insertMany([
    {
      ownerId: zohaId,
      projectId: p1Id,
      title: 'ML model ideas',
      body: 'Consider using transformer architecture for text classification.',
      tags: ['research', 'ml'],
      createdAt: new Date('2024-01-25')
    },
    {
      ownerId: rabiaId,
      projectId: p2Id,
      title: 'Design inspiration',
      body: 'Check dribbble for minimalist portfolio designs.',
      tags: ['design', 'inspiration'],
      createdAt: new Date('2024-02-03')
    },
    {
      ownerId: zohaId,
      title: 'Book recommendations',
      body: 'Clean Code by Robert Martin. Designing Data-Intensive Applications.',
      tags: ['personal', 'reading'],
      createdAt: new Date('2024-02-15')
    },
    {
      ownerId: rabiaId,
      projectId: p3Id,
      title: 'API endpoints plan',
      body: 'POST /auth/login, POST /auth/register, GET /tasks, POST /tasks',
      tags: ['coding', 'planning'],
      createdAt: new Date('2024-02-14')
    },
    {
      ownerId: rabiaId,
      title: 'Meeting notes',
      body: 'Discuss sprint goals every Monday 10am.',
      tags: ['planning', 'meetings'],
      createdAt: new Date('2024-02-22')
    },
    {
      ownerId: zohaId,
      projectId: p1Id,
      title: 'Supervisor feedback',
      body: 'Focus more on evaluation metrics. Add confusion matrix.',
      tags: ['research', 'feedback'],
      createdAt: new Date('2024-03-10')
    }
  ]);

  console.log('Database seeded successfully!');
  console.log('zoha@gmail.com / zoha1234');
  console.log('rabia@gmail.com   / rabia1234');
  process.exit(0);
})();