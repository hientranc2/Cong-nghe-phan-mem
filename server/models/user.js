import mongoose from "mongoose";
import { createSchema } from "./baseModel.js";

const UserSchema = createSchema({
  name: String,
  email: String,
  phone: String,
  avatar: String,
  role: String,
  address: mongoose.Schema.Types.Mixed,
});

export const User = mongoose.model("User", UserSchema);
