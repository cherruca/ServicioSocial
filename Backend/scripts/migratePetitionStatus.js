// Migration script: map boolean `status` fields on Petition documents
// to the new enum values: true -> 'approved', false -> 'pending'
// Usage:
// 1) Ensure `MONGODB_URI` is available in environment or .env
// 2) From project root run (PowerShell):
//    cd Backend; node .\scripts\migratePetitionStatus.js

import 'dotenv/config';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/proyectoDanie';

// Import the Petition model
import { Petition } from '../src/models/petition.model.js';

async function run() {
  console.log('Connecting to', mongoUri);
  await mongoose.connect(mongoUri, { autoIndex: false });

  try {
    // Update boolean true -> 'approved'
    const approvedResult = await Petition.updateMany(
      { $and: [ { status: { $type: 'bool' } }, { status: true } ] },
      { $set: { status: 'approved', approvedAt: new Date() } }
    );

    // Update boolean false -> 'pending'
    const pendingResult = await Petition.updateMany(
      { $and: [ { status: { $type: 'bool' } }, { status: false } ] },
      { $set: { status: 'pending' } }
    );

    console.log('Migration results:');
    console.log('- documents converted to approved:', approvedResult.modifiedCount ?? approvedResult.nModified ?? approvedResult.matchedCount);
    console.log('- documents converted to pending :', pendingResult.modifiedCount ?? pendingResult.nModified ?? pendingResult.matchedCount);

    // Optional: report remaining docs with boolean status (should be 0)
    const remainingBool = await Petition.countDocuments({ status: { $type: 'bool' } });
    console.log('- remaining documents with boolean status:', remainingBool);
  } catch (err) {
    console.error('Migration error:', err);
    process.exitCode = 2;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected. Migration complete.');
  }
}

run();
