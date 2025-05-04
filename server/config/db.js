const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("../models/user");

// Import your User model

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // After connection, ensure Admin user is created
    await createAdminUser();
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

// Function to create Admin
const createAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error("Admin email/password not set in .env");
      return;
    }

    // Check if Admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create Admin user
    const newAdmin = new User({
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      phone: "0000000000", // you can set default phone
      address: "Admin",
    });

    await newAdmin.save();
    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

module.exports = { connect };
