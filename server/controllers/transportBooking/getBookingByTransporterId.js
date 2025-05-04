const Booking = require("../../models/transporterBooking"); // Assuming the model is in this path


// Controller to get bookings by transporter ID
const getBookingsByTransporterId = async (req, res) => {
  const { id } = req.params; // Get transporterId from request parameters
    // console.log(id);
  try {

    // Find bookings where the transporter field matches the transporterId
    const bookings = await Booking.find({ transporter: id })
      .populate("farmer", "name phone") // Populate farmer details (optional)
      .populate("transporter" , "name phone") // Populate transporter details (optional)
      .exec();

      console.log(bookings);
    // If no bookings found, return a message
    if (!bookings || bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this transporter" });
    }


    // Return the bookings if found
    return res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error retrieving bookings:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getBookingsByTransporterId,
};
