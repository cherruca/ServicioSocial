// Seed script to create sample well-structured Petition documents.
// Usage: node ./scripts/seedPetitions.js
// The script will create a small set of example petitions. It does not
// delete existing documents.

import 'dotenv/config';
import mongoose from 'mongoose';
import { Petition } from '../src/models/petition.model.js';
import mongoosePkg from 'mongoose';

const { Types } = mongoosePkg;

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/proyectoDanie';

async function run() {
  await mongoose.connect(mongoUri, { autoIndex: false });
  try {
    const sample = [
      {
        date: new Date(),
        status: 'pending',
        students: [Types.ObjectId()],
        projects: [Types.ObjectId()]
      },
      {
        date: new Date(Date.now() - 1000 * 60 * 60 * 24),
        status: 'approved',
        students: [Types.ObjectId()],
        projects: [Types.ObjectId()],
        approvedAt: new Date(),
      }
    ];

    const created = await Petition.insertMany(sample);
    console.log(`Inserted ${created.length} sample petitions.`);
  } catch (err) {
    console.error('Error seeding petitions:', err);
    process.exitCode = 2;
  } finally {
    await mongoose.disconnect();
  }
}

run();
