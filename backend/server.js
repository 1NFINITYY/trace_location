// server.js
require("dotenv").config(); // ✅ must be at top

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const visitorRoutes = require("./routes/visitorRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Use env variable instead of hardcoded string
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

app.use("/api", visitorRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));