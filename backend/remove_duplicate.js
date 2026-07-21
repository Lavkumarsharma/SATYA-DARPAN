require('dotenv').config();
const mongoose = require('mongoose');
const Article = require('./src/models/Article');

const MONGO_URI = process.env.MONGO_URI;

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully!');

    console.log('Searching for duplicate article...');
    const result = await Article.deleteOne({ slug: 'jantar-mantar-protest-peaceful-protesters-par-police-action-aur-media-censorship-ka-poora-sach-1' });
    console.log('Delete result:', result);

    console.log('Successfully removed duplicate Jantar Mantar article.');
    process.exit(0);
  } catch (error) {
    console.error('Error running script:', error);
    process.exit(1);
  }
}

run();
