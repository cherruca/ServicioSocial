import { Schema, model } from "mongoose";

// create the model with its respective attributes and data types
const userSchema = new Schema({
  carnet: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  careers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Career",
    },
  ],
});

// constructor using the model previously created
const User = model("User", userSchema);

export { User };
