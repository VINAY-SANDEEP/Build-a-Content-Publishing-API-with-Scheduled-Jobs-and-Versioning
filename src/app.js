require("dotenv").config();
const express = require("express");
const Redis = require("ioredis");

const authRoutes = require("./routes/auth.routes");
const postsRoutes = require("./routes/posts.routes");
const mediaRoutes = require("./routes/media.routes");
const publicRoutes = require("./routes/public.routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const redis = new Redis({
  host: process.env.REDIS_HOST || "redis",
  port: 6379,
  maxRetriesPerRequest: null
});

redis.on("connect", () => console.log("✅ Connected to Redis"));
redis.on("error", (err) => console.error("❌ Redis connection error:", err.message));

app.locals.redis = redis;

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/auth", authRoutes);
app.use("/posts", postsRoutes);
app.use("/media", mediaRoutes);
app.use("/", publicRoutes);

app.use(errorHandler);

app.get("/health", (req, res) => res.status(200).json({ status: "OK" }));

module.exports = app;
