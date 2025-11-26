#!/usr/bin/env node
/**
 * CLI script to run the student role migration.
 * Usage: node Backend/scripts/migrate-student-role.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { migrateStudentRole } from "../src/utils/migrateStudentRole.js";

dotenv.config();

const main = async () => {
  try {
    // Connect to MongoDB
    const mongoUri =
      process.env.MONGODB_URI ||
      process.env.MONGO_URI ||
      "mongodb://localhost:27017/social-service";
    console.log(`[migrate] Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log("[migrate] Connected to MongoDB");

    // Run migration
    await migrateStudentRole();

    // Disconnect
    await mongoose.disconnect();
    console.log("[migrate] Disconnected from MongoDB");
  } catch (error) {
    console.error(
      "[migrate] Fatal error:",
      error && error.message ? error.message : error
    );
    process.exit(1);
  }
};

main();
