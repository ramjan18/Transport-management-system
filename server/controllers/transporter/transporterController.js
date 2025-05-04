const Transporter = require("../../models/transporter");

// Create transporter
const createTransporter = async (req, res) => {
  try {
    const { user, transportRatePerKm, vehicleNumber, vehicleType } = req.body;

    if (!user || !transportRatePerKm || !vehicleNumber || !vehicleType) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if transporter already exists for the user
    // const existingTransporter = await Transporter.findOne({ user });
    // if (existingTransporter) {
    //   return res
    //     .status(400)
    //     .json({ message: "Transporter already exists for this user." });
    // }

    const newTransporter = new Transporter({
      user,
      transportRatePerKm,
      vehicleNumber,
      vehicleType,
    });

    await newTransporter.save();

    res
      .status(201)
      .json({
        message: "Transporter created successfully.",
        transporter: newTransporter,
      });
  } catch (error) {
    console.error("Create Transporter error:", error);
    res
      .status(500)
      .json({ message: "Server error while creating transporter." });
  }
};

// Get all transporters
const getAllTransporters = async (req, res) => {
  try {
    const transporters = await Transporter.find()
      .populate("user", "name phone email address role") // populate basic user info
      .sort({ createdAt: -1 });

    res.status(200).json({ transporters });
  } catch (error) {
    console.error("Get All Transporters error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching transporters." });
  }
};

// Get transporter by ID
const getTransporterById = async (req, res) => {
  try {
    const { id } = req.params;

    const transporter = await Transporter.findById(id).populate(
      "user",
      "name phone email address role"
    );

    if (!transporter) {
      return res.status(404).json({ message: "Transporter not found." });
    }

    res.status(200).json({ transporter });
  } catch (error) {
    console.error("Get Transporter by ID error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching transporter." });
  }
};

// Update transporter
const updateTransporter = async (req, res) => {
  try {
    const { id } = req.params;
    const { transportRatePerKm, vehicleNumber, vehicleType, available } =
      req.body;

    const transporter = await Transporter.findById(id);
    if (!transporter) {
      return res.status(404).json({ message: "Transporter not found." });
    }

    if (transportRatePerKm !== undefined)
      transporter.transportRatePerKm = transportRatePerKm;
    if (vehicleNumber) transporter.vehicleNumber = vehicleNumber;
    if (vehicleType) transporter.vehicleType = vehicleType;
    if (available !== undefined) transporter.available = available;

    const updatedTransporter = await transporter.save();

    res
      .status(200)
      .json({
        message: "Transporter updated successfully.",
        transporter: updatedTransporter,
      });
  } catch (error) {
    console.error("Update Transporter error:", error);
    res
      .status(500)
      .json({ message: "Server error while updating transporter." });
  }
};

// Delete transporter
const deleteTransporter = async (req, res) => {
  try {
    const { id } = req.params;

    const transporter = await Transporter.findByIdAndDelete(id);

    if (!transporter) {
      return res.status(404).json({ message: "Transporter not found." });
    }

    res.status(200).json({ message: "Transporter deleted successfully." });
  } catch (error) {
    console.error("Delete Transporter error:", error);
    res
      .status(500)
      .json({ message: "Server error while deleting transporter." });
  }
};

module.exports = {
  deleteTransporter,
  updateTransporter,
  getTransporterById,
  getAllTransporters,
  createTransporter,
};