// controllers/userController.js

const User = require("../../models/user");

// Already have getAllUsers above...

const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;

    if (!role) {
      return res.status(400).json({ message: "Role parameter is required." });
    }

    const validRoles = ["farmer", "transporter", "trader"];
    if (!validRoles.includes(role)) {
      return res
        .status(400)
        .json({
          message: "Invalid role. Must be farmer, transporter, or trader.",
        });
    }

    const users = await User.find({ role }).select("-password");

    res.status(200).json({
      message: `All ${role}s fetched successfully.`,
      users,
    });
  } catch (error) {
    console.error("Get Users by Role error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching users by role." });
  }
};


module.exports = { getUsersByRole };