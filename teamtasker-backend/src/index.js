require('dotenv').config();
const express = require('express');
const connectMongo = require('./config/mongo');
const cors = require("cors")


const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const commentRoutes = require('./routes/comments');
const notificationRoutes = require('./routes/notifications');
const analyticsRoutes = require('./routes/analytics');

const app = express();
app.use(express.json());

const corsOptions = {
    origin:"http://localhost:3000",
    methods:"GET,PUT,PATCH,DELETE,POST,HEAD",
    credentials:true
}

app.use(cors(corsOptions))

// basic health
app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

async function start() {
  try {
    await connectMongo();
    const port = process.env.PORT || 4000;
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  } catch (err) {
    console.error('Startup failed:', err);
    process.exit(1);
  }
}

start();
