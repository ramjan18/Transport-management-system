// controllers/goodsController.js

const Goods = require("../../models/goods");

// Create goods (Add new good)
const createGoods = async (req, res) => {
  try {
    const { farmer, name, quantity, pricePerUnit, unit, description } =
      req.body;

    if (!farmer || !name || !quantity || !pricePerUnit) {
      return res
        .status(400)
        .json({
          message: "Farmer, Name, Quantity, and Price are required fields.",
        });
    }

    const newGoods = new Goods({
      farmer,
      name,
      quantity,
      pricePerUnit,
      unit: unit || "kg", // Default to kg if not provided
      description: description || "",
    });

    await newGoods.save();

    res.status(201).json({
      message: "Goods created successfully.",
      goods: newGoods,
    });
  } catch (error) {
    console.error("Create Goods error:", error);
    res.status(500).json({ message: "Server error while creating goods." });
  }
};

// Get all goods
const getAllGoods = async (req, res) => {
  try {
    const goods = await Goods.find()
      .populate("farmer", "name phone email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All goods fetched successfully.",
      goods,
    });
  } catch (error) {
    console.error("Get All Goods error:", error);
    res.status(500).json({ message: "Server error while fetching goods." });
  }
};

// Get goods by ID
const getGoodsById = async (req, res) => {
  try {
    const { id } = req.params;

    const goods = await Goods.findById(id).populate(
      "farmer",
      "name phone email"
    );

    if (!goods) {
      return res.status(404).json({ message: "Goods not found." });
    }

    res.status(200).json({
      message: "Goods fetched successfully.",
      goods,
    });
  } catch (error) {
    console.error("Get Goods by ID error:", error);
    res.status(500).json({ message: "Server error while fetching goods." });
  }
};

// Update goods
const updateGoods = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, pricePerUnit, unit, description, available } =
      req.body;

    const goods = await Goods.findById(id);
    if (!goods) {
      return res.status(404).json({ message: "Goods not found." });
    }

    if (name) goods.name = name;
    if (quantity !== undefined) goods.quantity = quantity;
    if (pricePerUnit !== undefined) goods.pricePerUnit = pricePerUnit;
    if (unit) goods.unit = unit;
    if (description !== undefined) goods.description = description;
    if (available !== undefined) goods.available = available;

    const updatedGoods = await goods.save();

    res.status(200).json({
      message: "Goods updated successfully.",
      goods: updatedGoods,
    });
  } catch (error) {
    console.error("Update Goods error:", error);
    res.status(500).json({ message: "Server error while updating goods." });
  }
};

// Delete goods
const deleteGoods = async (req, res) => {
  try {
    const { id } = req.params;

    const goods = await Goods.findByIdAndDelete(id);

    if (!goods) {
      return res.status(404).json({ message: "Goods not found." });
    }

    res.status(200).json({ message: "Goods deleted successfully." });
  } catch (error) {
    console.error("Delete Goods error:", error);
    res.status(500).json({ message: "Server error while deleting goods." });
  }
};

module.exports = {
  createGoods,
  getAllGoods,
  getGoodsById,
  updateGoods,
  deleteGoods,
};
