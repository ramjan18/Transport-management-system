// models/Transporter.js

const mongoose = require("mongoose");

const transporterSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transportRatePerKm: {
      type: Number,
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
    },
    vehicleType: {
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Transporter = mongoose.model("Transporter", transporterSchema);
module.exports = Transporter;
