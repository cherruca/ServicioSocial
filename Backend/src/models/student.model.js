/**
 * @openapi
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       properties:
 *         carnet:
 *           type: string
 *         name:
 *           type: string
 *         hours:
 *           type: integer
 *         picture:
 *           type: string
 *         email:
 *           type: string
 *         careers:
 *           type: array
 *           items:
 *             type: string
 */
import { Schema, model } from "mongoose";

// create the model with its respective attributes and data types
const studentSchema = new Schema({
  carnet: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  hours: {
    type: Number,
    required: true,
  },
  picture: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: Date,
    default: Date.now(),
  },
  careers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Career",
    },
  ],
});

// constructor using the model previously created
const Student = model("Student", studentSchema);

export { Student };
