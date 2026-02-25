const express = require("express");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());

// Test route - GET http://localhost:3000/api/health to verify server is up
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/api/auth", authRoutes);

module.exports = app;