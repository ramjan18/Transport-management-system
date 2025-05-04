require("dotenv").config();
const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const login = async (req, res) => {
  try {
    const { phoneOrEmail, password } = req.body;

    // 1. Validate input
    if (!phoneOrEmail || !password) {
      return res
        .status(400)
        .json({ message: "Phone/Email and password are required." });
    }

    // 2. Find user by phone OR email
    const user = await User.findOne({
      $or: [{ phone: phoneOrEmail }, { email: phoneOrEmail }],
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid phone/email or password." });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid phone/email or password." });
    }

    console.log(process.env.JWT_SECRET);
    // 4. Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5. Send response
    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        address: user.address,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};

module.exports = { login };
