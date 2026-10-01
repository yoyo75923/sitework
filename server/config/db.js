const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  let uri = process.env.MONGODB_URI;
  const isPlaceholder = !uri || uri.includes('username:password');

  if (!isPlaceholder) {
    try {
      console.log(`Connecting to MongoDB at configured URI...`);
      const conn = await mongoose.connect(uri, {
        autoSelectFamily: false,
        serverSelectionTimeoutMS: 10000,
        tls: true,
        maxPoolSize: 10,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.warn(`Could not connect to configured MONGODB_URI: ${error.message}`);
      console.log('Falling back to local in-memory MongoDB instance...');
    }
  } else {
    console.log('No external MongoDB URI specified in .env. Starting zero-config local in-memory MongoDB...');
  }

  // Use MongoMemoryServer for immediate, zero-config local running without Docker or manual install
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create();
    uri = mongodInstance.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`✓ Local In-Memory MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed if database is empty
    const Product = require('../models/Product');
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('Database empty — seeding demo data and 41 products...');
      const seedData = require('../seeds/seedAll');
      await seedData(false);
      console.log('✓ Initial seed completed!');
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
