const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Watchlist = require("../models/Watchlist");

router.get("/", authMiddleware, async (req, res) => {
  console.log("userid after authmiddleware run", req);
  const watchlist = await Watchlist.find({ userId: req.user.id });
  res.json(watchlist);
});

router.post("/", authMiddleware, async (req, res) => {
  const { coinId, coinName } = req.body;
  try {
    const existingItem = await Watchlist.findOne({
      userId: req.user.id,
      coinId,
    });
    if (existingItem) {
      return res
        .status(400)
        .json({ error: " Chosen coin already exists in the list" });
    } else {
      const item = await new Watchlist({
        userId: req.user.id,
        coinId,
        coinName,
      });
      await item.save();
      return res.status(201).json(item);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.delete("/:coinId", authMiddleware, async (req, res) => {
  const coinId = req.params.coinId;
  try {
    const itemToDelete = await Watchlist.findOneAndDelete({
      userId: req.user.id,
      coinId,
    });
    if (itemToDelete)
      return res
        .status(200)
        .json({ message: "Removed the selected item from your watchlist" });
    else
      return res
        .status(400)
        .json({
          message: "Facing issue in removing your selected coin, try again ",
        });
  } catch (error) {
    res.status(500).json({ error: "Error in connecting to delete the coin" });
  }
});

module.exports = router;
