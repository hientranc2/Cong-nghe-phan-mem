import mongoose from "mongoose";
import { createSchema } from "./baseModel.js";

const CategorySchema = createSchema({
  slug: String,
  icon: String,
  title: String,
  description: String,
  heroTitle: String,
  heroDescription: String,
  translations: mongoose.Schema.Types.Mixed,
});

export const Category = mongoose.model("Category", CategorySchema);
