import { createSchema } from "./baseModel.js";
import mongoose from "mongoose";

const DroneSchema = createSchema({
  name: String,
  status: String,
  battery: Number,
  lastMission: String,
  translations: mongoose.Schema.Types.Mixed,
});

export const Drone = mongoose.model("Drone", DroneSchema);
