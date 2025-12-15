import mongoose from "mongoose";
import { createSchema } from "./baseModel.js";

const OrderSchema = createSchema({
  status: String,
  total: Number,
  itemsCount: Number,
  source: String,
  userId: String,
  createdAt: String,
  estimatedDelivery: String,
  paymentMethod: String,
  paymentDescription: String,
  subtotal: Number,
  shipping: Number,
  customer: mongoose.Schema.Types.Mixed,
  address: mongoose.Schema.Types.Mixed,
  items: [mongoose.Schema.Types.Mixed],
  destination: String,
  droneId: String,
  restaurantId: String,
  restaurantSlug: String,
  restaurantName: String,
  restaurantAddress: String,
  note: String,
  ownerEmail: String,
});

export const Order = mongoose.model("Order", OrderSchema);
