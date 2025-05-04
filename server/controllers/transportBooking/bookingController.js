// controllers/transportBookingController.js

const TransportBooking = require("../../models/transporterBooking");
const Transporter = require("../../models/transporter");
const Goods = require("../../models/goods");

// Create a new transport booking
const createTransportBooking = async (req, res) => {
  try {
    const {
      transporter,
      farmer,
      // goods,
      pickupLocation,
      dropLocation,
      distanceInKm,
      transportRatePerKm,
    } = req.body;

    // Validate required fields
    if (
      !transporter ||
      // !goods ||
      !pickupLocation ||
      !dropLocation ||
      !distanceInKm ||
      !transportRatePerKm
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if transporter exists
    const transporterDetails = await Transporter.findById(transporter);
    if (!transporterDetails) {
      return res.status(404).json({ message: "Transporter not found." });
    }

    // Check if goods exist
    // const goodsDetails = await Goods.findById(goods);
    // if (!goodsDetails) {
    //   return res.status(404).json({ message: "Goods not found." });
    // }

    // Calculate total cost based on distance and rate
    const totalCost = distanceInKm * transportRatePerKm;

    const newBooking = new TransportBooking({
      // farmer: req.user._id, // Assuming the user is already authenticated
      transporter: transporterDetails.user,
      farmer,
      // goods,
      pickupLocation,
      dropLocation,
      distanceInKm,
      transportRatePerKm,
      totalCost,
      bookingStatus: "pending", // Default status
    });

    await newBooking.save();

    res.status(201).json({
      message: "Transport booking created successfully.",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Create Transport Booking error:", error);
    res
      .status(500)
      .json({ message: "Server error while creating transport booking." });
  }
};

// Get all transport bookings
const getAllTransportBookings = async (req, res) => {
  try {
    const bookings = await TransportBooking.find()
      .populate("transporter", "vehicleNumber vehicleType")
      // .populate("goods", "name quantity")
      .populate("farmer", "name phone email") // Populate farmer details
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All transport bookings fetched successfully.",
      bookings,
    });
  } catch (error) {
    console.error("Get All Transport Bookings error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching transport bookings." });
  }
};

// Get transport booking by ID
const getTransportBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await TransportBooking.findById(id)
      .populate("transporter", "vehicleNumber vehicleType")
      // .populate("goods", "name quantity")
      .populate("farmer", "name phone email");

    if (!booking) {
      return res.status(404).json({ message: "Transport booking not found." });
    }

    res.status(200).json({
      message: "Transport booking fetched successfully.",
      booking,
    });
  } catch (error) {
    console.error("Get Transport Booking by ID error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching transport booking." });
  }
};
// Update transport booking (e.g., update status, cost, or paymentStatus)
const updateTransportBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      bookingStatus,
      distanceInKm,
      transportRatePerKm,
      pickupLocation,
      dropLocation,
      paymentStatus, // ⬅️ pick up paymentStatus
    } = req.body;

    const booking = await TransportBooking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Transport booking not found." });
    }

    // Update booking fields if provided
    if (bookingStatus) booking.bookingStatus = bookingStatus;
    if (distanceInKm !== undefined) booking.distanceInKm = distanceInKm;
    if (transportRatePerKm !== undefined)
      booking.transportRatePerKm = transportRatePerKm;
    if (pickupLocation) booking.pickupLocation = pickupLocation;
    if (dropLocation) booking.dropLocation = dropLocation;
    if (paymentStatus) booking.paymentStatus = paymentStatus; // ⬅️ set paymentStatus

    // Recalculate totalCost if we have valid numbers
    if (
      typeof booking.distanceInKm === "number" &&
      !isNaN(booking.distanceInKm) &&
      typeof booking.transportRatePerKm === "number" &&
      !isNaN(booking.transportRatePerKm)
    ) {
      booking.totalCost = booking.distanceInKm * booking.transportRatePerKm;
    }

    const updatedBooking = await booking.save();

    res.status(200).json({
      message: "Transport booking updated successfully.",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Update Transport Booking error:", error);
    res
      .status(500)
      .json({ message: "Server error while updating transport booking." });
  }
};

// Delete transport booking
const deleteTransportBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await TransportBooking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({ message: "Transport booking not found." });
    }

    res
      .status(200)
      .json({ message: "Transport booking deleted successfully." });
  } catch (error) {
    console.error("Delete Transport Booking error:", error);
    res
      .status(500)
      .json({ message: "Server error while deleting transport booking." });
  }
};

module.exports = {
  createTransportBooking,
  getAllTransportBookings,
  getTransportBookingById,
  updateTransportBooking,
  deleteTransportBooking,
};
