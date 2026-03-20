// models/Visitor.js
const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    unique: true, // ✅ ensures no duplicate IPs
  },
  city: {
    type: String,
    default: "Unknown",
  },
  region: {
    type: String,
    default: "Unknown",
  },
  country: {
    type: String,
    default: "Unknown",
  },
  userAgent: String,

  visitCount: {
    type: Number,
    default: 1, // ✅ start from 1
  },

  lastVisitedAt: {
    type: Date,
    default: Date.now,
  },

}, { timestamps: true }); // adds createdAt, updatedAt

module.exports = mongoose.model("Visitor", visitorSchema);