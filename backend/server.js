const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Test API Route
app.get("/healthcheck", (req, res) => {
  res.status(200).json([{ message: "Fitness Tracker API Running!" }]);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
