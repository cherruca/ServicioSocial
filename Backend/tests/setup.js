import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { connectiondb } from '../src/config/dbConnection.config.js';

let mongoServer;

(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGODB_URI = uri;
    try {
        await mongoose.connect(uri);
        console.log('[tests/setup] connected to in-memory mongo');
    } catch (e) {
        console.error('[tests/setup] mongoose connect error', e);
        throw e;
    }
})();

export async function teardown() {
    try {
        await mongoose.disconnect();
    } finally {
        if (mongoServer) await mongoServer.stop();
    }
}

export { mongoServer };