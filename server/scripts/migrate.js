import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Category, MenuItem, Restaurant, Order, User, Drone } from "../models/index.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Missing MONGO_URI in environment. Please set it before migrating data.");
  process.exit(1);
}

const COLLECTION_MAP = {
  categories: Category,
  menuItems: MenuItem,
  restaurants: Restaurant,
  orders: Order,
  users: User,
  drones: Drone,
};

const loadDatabaseFile = async () => {
  const dbPath = path.resolve(__dirname, "../../db.json");
  const fileContent = await fs.readFile(dbPath, "utf-8");
  return JSON.parse(fileContent);
};

const upsertDocuments = async (Model, documents) => {
  if (!documents.length) return;

  const operations = documents.map((item) => {
    const { id, _id, ...rest } = item;
    const documentId = id ?? _id ?? new mongoose.Types.ObjectId().toString();

    return {
      updateOne: {
        filter: { _id: documentId },
        update: { $set: { _id: documentId, ...rest } },
        upsert: true,
      },
    };
  });

  await Model.bulkWrite(operations, { ordered: false });
};

const migrate = async () => {
  const data = await loadDatabaseFile();
  await mongoose.connect(MONGO_URI);

  for (const [collection, Model] of Object.entries(COLLECTION_MAP)) {
    const documents = Array.isArray(data[collection]) ? data[collection] : [];
    await upsertDocuments(Model, documents);
    console.log(`Migrated ${documents.length} records into ${collection}`);
  }

  await mongoose.disconnect();
};

migrate().catch((error) => {
  console.error("Migration failed", error);
  process.exit(1);
});
