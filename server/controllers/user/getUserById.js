// controllers/userController.js

const User = require("../../models/user");

// ...other controllers

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "User fetched successfully.",
      user,
    });
  } catch (error) {
    console.error("Get User by ID error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching user by ID." });
  }
};


module.exports = {getUserById}