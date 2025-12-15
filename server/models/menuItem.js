import mongoose from "mongoose";
import { createSchema } from "./baseModel.js";

const MenuItemSchema = createSchema({
  categoryId: String,
  name: String,
  description: String,
  price: Number,
  img: String,
  image: String,
  calories: Number,
  time: Number,
  tag: String,
  isBestSeller: Boolean,
  translations: mongoose.Schema.Types.Mixed,
  restaurantId: String,
  restaurantSlug: String,
  restaurantName: String,
  quantity: Number,
});

export const MenuItem = mongoose.model("MenuItem", MenuItemSchema);
