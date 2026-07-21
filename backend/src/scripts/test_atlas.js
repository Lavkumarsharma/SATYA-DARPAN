const mongoose = require('mongoose');

const uri = 'mongodb+srv://satya-darpan:satyadarpan@satyadarpan.0xflrrn.mongodb.net/?appName=satyadarpan';

async function test() {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('SUCCESS: Connected to MongoDB Atlas!');
    process.exit(0);
  } catch (err) {
    console.error('FAILED to connect to Atlas:', err.message);
    process.exit(1);
  }
}

test();
