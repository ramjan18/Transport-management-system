// controllers/authController.js

const User = require("../../models/user");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  try {
    const { name, phone, email, password, role, address } = req.body;

    // 1. Validate input
    if (!name || !phone || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ $or: [{ phone }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this phone or email." });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create new user
    const newUser = new User({
      name,
      phone,
      email,
      password: hashedPassword,
      role,
      address,
    });

    // 5. Save user
    await newUser.save();

    res.status(201).json({ message: "User registered successfully.", newUser });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup." });
  }
};

module.exports = { signup };
