// models/TransportBooking.js

const mongoose = require("mongoose");

const transportBookingSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // goods: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Goods",
    //   required: true,
    // },
    pickupLocation: {
      type: String,
      required: true,
    },
    dropLocation: {
      type: String,
      required: true,
    },
    distanceInKm: {
      type: Number,
      required: true,
    },
    transportRatePerKm: {
      type: Number,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ["pending", "accepted", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", transportBookingSchema);
module.exports = Booking;
