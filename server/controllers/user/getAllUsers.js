// controllers/userController.js

const User = require("../../models/user");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // fetch all users but do NOT send password

    res.status(200).json({
      message: "All users fetched successfully.",
      users,
    });
  } catch (error) {
    console.error("Get All Users error:", error);
    res.status(500).json({ message: "Server error while fetching users." });
  }
};


module.exports = {getAllUsers}