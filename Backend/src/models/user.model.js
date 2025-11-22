import { Schema, model } from "mongoose";

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

const User = model("User", userSchema);

export { User };
