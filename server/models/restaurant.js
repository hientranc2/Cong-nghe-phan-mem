import mongoose from "mongoose";
import { createSchema } from "./baseModel.js";

const RestaurantSchema = createSchema({
  slug: String,
  name: String,
  description: String,
  address: String,
  phone: String,
  email: String,
  heroTitle: String,
  heroDescription: String,
  image: String,
  translations: mongoose.Schema.Types.Mixed,
});

export const Restaurant = mongoose.model("Restaurant", RestaurantSchema);
