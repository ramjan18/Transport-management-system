// models/Goods.js

const mongoose = require("mongoose");

const goodsSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number, // Quantity in kilograms or quintals etc
      required: true,
    },
    pricePerUnit: {
      type: Number, // Price per kg or quintal
      required: true,
    },
    unit: {
      type: String,
      enum: ["kg", "quintal", "ton"],
      default: "kg",
    },
    description: {
      type: String,
      default: "",
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


const Goods = mongoose.model("Goods", goodsSchema);
module.exports = Goods;

