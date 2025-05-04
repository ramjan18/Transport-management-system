const express = require("express");
const router = express.Router();

const {
  createTransportBooking,
  getAllTransportBookings,
  getTransportBookingById,
  updateTransportBooking,
  deleteTransportBooking,
} = require("../controllers/transportBooking/bookingController");

const { getBookingsByTransporterId} = require('../controllers/transportBooking/getBookingByTransporterId');
const {getBookingsByFarmerId} = require('../controllers/transportBooking/getBookingsByFarmerId')

// Transport booking routes
router.get("/getBookingsByFarmerId/:id", getBookingsByFarmerId);
router.get("/getBookingsByTransporterId/:id", getBookingsByTransporterId);
router.post("/book", createTransportBooking); // Create booking
router.get("/bookings", getAllTransportBookings); // Get all bookings
router.get("/bookings/:id", getTransportBookingById); // Get a booking by ID
router.patch("/bookings/:id", updateTransportBooking); // Update a booking
router.delete("/bookings/:id", deleteTransportBooking); // Delete a booking

module.exports = router;
