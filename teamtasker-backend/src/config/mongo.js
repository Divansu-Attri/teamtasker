const mongoose = require('mongoose');

async function connectMongo() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI not set in .env');
    await mongoose.connect(uri, { dbName: 'teamtasker' });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    throw err;
  }
}

module.exports = connectMongo;
