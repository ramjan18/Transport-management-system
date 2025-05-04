// controllers/bookingController.js

const Booking = require("../../models/transporterBooking");

// Get bookings by Farmer ID
const getBookingsByFarmerId = async (req, res) => {
  try {
    const {id} = req.params;

    const bookings = await Booking.find({ farmer: id })
      .populate("farmer", "name email phone") // Populate farmer details (optional)
      .populate("transporter", "vehicleNumber name phone"); // Populate transporter details (optional)

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching bookings by farmer ID:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error while fetching bookings",
      });
  }
};


module.exports = { getBookingsByFarmerId };