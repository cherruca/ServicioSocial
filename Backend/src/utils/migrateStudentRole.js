/**
 * Migration helper to add role field to existing student documents.
 * Run this once to ensure all students have a role field.
 *
 * Usage in Node REPL or script:
 *   import { migrateStudentRole } from './src/utils/migrateStudentRole.js';
 *   await migrateStudentRole();
 */
import { Student } from "../models/student.model.js";

export const migrateStudentRole = async () => {
  try {
    console.log("[migrateStudentRole] Starting migration...");

    // Find all students without a role field
    const studentsWithoutRole = await Student.find({
      role: { $exists: false },
    });
    console.log(
      `[migrateStudentRole] Found ${studentsWithoutRole.length} students without role field`
    );

    if (studentsWithoutRole.length === 0) {
      console.log("[migrateStudentRole] All students already have role field");
      return;
    }

    // Update all students without role to have role: 'student'
    const result = await Student.updateMany(
      { role: { $exists: false } },
      { $set: { role: "student" } }
    );

    console.log(
      `[migrateStudentRole] Updated ${result.modifiedCount} students`
    );
    console.log("[migrateStudentRole] Migration complete!");
  } catch (error) {
    console.error(
      "[migrateStudentRole] Error:",
      error && error.message ? error.message : error
    );
    throw error;
  }
};

export default migrateStudentRole;
