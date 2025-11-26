#!/usr/bin/env node
/**
 * CLI script to set a student's role to admin.
 * Usage: node Backend/scripts/set-student-admin.js <email>
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Student } from "../src/models/student.model.js";

dotenv.config();

const main = async () => {
  const email = process.argv[2];

  if (!email) {
    console.error(
      "[setStudentAdmin] Usage: node scripts/set-student-admin.js <email>"
    );
    process.exit(1);
  }

  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      process.env.MONGO_URI ||
      "mongodb://localhost:27017/social-service";
    console.log(`[setStudentAdmin] Connecting to MongoDB...`);
    await mongoose.connect(mongoUri);
    console.log("[setStudentAdmin] Connected to MongoDB");

    // Find and update student
    const result = await Student.findOneAndUpdate(
      { email },
      { $set: { role: "admin" } },
      { new: true }
    );

    if (!result) {
      console.error(
        `[setStudentAdmin] Student with email "${email}" not found`
      );
      process.exit(1);
    }

    console.log(`[setStudentAdmin] Updated student to admin:`);
    console.log(`  Email: ${result.email}`);
    console.log(`  Name: ${result.name}`);
    console.log(`  Role: ${result.role}`);

    await mongoose.disconnect();
    console.log("[setStudentAdmin] Done!");
  } catch (error) {
    console.error(
      "[setStudentAdmin] Fatal error:",
      error && error.message ? error.message : error
    );
    process.exit(1);
  }
};

main();
