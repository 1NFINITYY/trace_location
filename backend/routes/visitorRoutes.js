const express = require("express");
const axios = require("axios");
const Visitor = require("../models/Visitor");

const router = express.Router();

// ✅ TRACK ROUTE (already exists)
router.get("/track", async (req, res) => {
  try {
    let ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      req.ip;

    // Normalize IPv6
    if (ip.startsWith("::ffff:")) {
      ip = ip.replace("::ffff:", "");
    }

    const isLocalhost = ip === "::1" || ip === "127.0.0.1";

    let city = "Unknown";
    let region = "Unknown";
    let country = "Unknown";

    if (!isLocalhost) {
      try {
        const geo = await axios.get(`https://ipapi.co/${ip}/json/`);
        city = geo.data.city || "Unknown";
        region = geo.data.region || "Unknown";
        country = geo.data.country_name || "Unknown";
      } catch (err) {
        console.log("Geo API failed");
      }
    } else {
      city = "Local";
      country = "Local";
    }

    const visitor = await Visitor.findOneAndUpdate(
      { ip },
      {
        $inc: { visitCount: 1 },
        $set: {
          city,
          region,
          country,
          userAgent: req.headers["user-agent"],
          lastVisitedAt: new Date(),
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    res.json({
      message: "Visitor tracked",
      visitor,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// ✅ ADD THIS STATS ROUTE
router.get("/stats", async (req, res) => {
  try {
    const totalVisitors = await Visitor.countDocuments();

    const totalVisitsAgg = await Visitor.aggregate([
      {
        $group: {
          _id: null,
          totalVisits: { $sum: "$visitCount" },
        },
      },
    ]);

    const totalVisits = totalVisitsAgg[0]?.totalVisits || 0;

    const visitors = await Visitor.find()
      .sort({ lastVisitedAt: -1 })
      .limit(20);

    res.json({
      totalVisitors,
      totalVisits,
      visitors,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;