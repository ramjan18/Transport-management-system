// controllers/userController.js

const User = require("../../models/user");
const bcrypt = require("bcryptjs");

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, address, password } = req.body;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update basic fields if provided
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (email) user.email = email;
    if (address) user.address = address;

    // Handle password update if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Save updated user
    const updatedUser = await user.save();

    res.status(200).json({
      message: "User updated successfully.",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        phone: updatedUser.phone,
        email: updatedUser.email,
        role: updatedUser.role,
        address: updatedUser.address,
      },
    });
  } catch (error) {
    console.error("Update User error:", error);
    res.status(500).json({ message: "Server error while updating user." });
  }
};


module.exports = {updateUser};