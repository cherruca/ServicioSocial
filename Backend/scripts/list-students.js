#!/usr/bin/env node
/**
 * CLI script to list all students.
 * Usage: node Backend/scripts/list-students.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Student } from "../src/models/student.model.js";

dotenv.config();

const main = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      process.env.MONGO_URI ||
      "mongodb://localhost:27017/social-service";
    await mongoose.connect(mongoUri);

    const students = await Student.find(
      {},
      { email: 1, name: 1, role: 1 }
    ).lean();

    console.log("\n=== Students in database ===");
    if (students.length === 0) {
      console.log("(no students found)");
    } else {
      students.forEach((s, i) => {
        console.log(`${i + 1}. ${s.email} (${s.name}) role=${s.role || "N/A"}`);
      });
    }
    console.log("");

    await mongoose.disconnect();
  } catch (error) {
    console.error(
      "[listStudents] Error:",
      error && error.message ? error.message : error
    );
    process.exit(1);
  }
};

main();
