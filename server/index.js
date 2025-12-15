import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createCrudRouter } from "./routes/createCrudRouter.js";
import { Category, MenuItem, Restaurant, Order, User, Drone } from "./models/index.js";

dotenv.config();

const PORT = process.env.PORT ?? 4000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Missing MONGO_URI in environment. Please set it before starting the API server.");
  process.exit(1);
}

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/categories", createCrudRouter(Category));
app.use("/menuItems", createCrudRouter(MenuItem));
app.use("/restaurants", createCrudRouter(Restaurant));
app.use("/orders", createCrudRouter(Order));
app.use("/users", createCrudRouter(User));
app.use("/drones", createCrudRouter(Drone));

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Internal Server Error" });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  });
