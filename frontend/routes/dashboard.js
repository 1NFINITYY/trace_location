// routes/dashboard.js
router.get("/stats", async (req, res) => {
  const total = await Visitor.countDocuments();

  const recent = await Visitor.find()
    .sort({ visitedAt: -1 })
    .limit(10);

  res.json({ total, recent });
});