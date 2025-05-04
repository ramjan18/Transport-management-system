const express = require("express");
const router = express.Router();
const {
  createTransporter,
  getAllTransporters,
  getTransporterById,
  updateTransporter,
  deleteTransporter,
} = require("../controllers/transporter/transporterController");

const {
  getTransporterByUserId,
} = require("../controllers/transporter/getTransporterByuser");

// Routes for transporters
router.get("/getTransporterByUser/:id", getTransporterByUserId);
router.post("/createtransporter", createTransporter); // Create a transporter
router.get("/getAllTransporters", getAllTransporters); // Get all transporters
router.get("/transporter/:id", getTransporterById); // Get a transporter by ID
router.patch("/editTransporter/:id", updateTransporter); // Update a transporter
router.delete("/deleteTransporter/:id", deleteTransporter); // Delete a transporter


// Get transporter by user ID (for the logged-in user)
// router.get("/transporter-by-user", authMiddleware, getTransporterByUserId); // Get transporter for a logged-in user

module.exports = router;
