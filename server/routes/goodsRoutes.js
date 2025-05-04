const express = require("express");
const router = express.Router();
const {
  createGoods,
  getAllGoods,
  getGoodsById,
  updateGoods,
  deleteGoods,
//   getGoodsByFarmerId,
} = require("../controllers/goods/goodsController");

const {getGoodsByFarmer} = require('../controllers/goods/getGoodsByFarmerId');
// const { authMiddleware } = require("../middlewares/authMiddleware");

// Routes for goods
router.post("/createGoods",  createGoods); // Create a new goods item
router.get("/getAllGoods", getAllGoods); // Get all goods
router.get("/goods/:id", getGoodsById); // Get goods by ID
router.patch("/goods/:id",  updateGoods); // Update a goods item
router.delete("/goods/:id",  deleteGoods); // Delete a goods item
router.get('/getFarmerGoods/:id' , getGoodsByFarmer);

// Get goods by farmer ID (for the logged-in user)
// router.get("/goods-by-farmer", authMiddleware, getGoodsByFarmerId); // Get goods for a logged-in farmer

module.exports = router;
