import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import HealthInstitution from "../models/HealthInstitution.js";

dotenv.config(); // Load .env config

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("MongoDB connected. Seeding data...");

    // Optional: Create a health institution if needed
    const institution = new HealthInstitution({ name: "KBC Zemun" });
    await institution.save();

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const user = new User({
      username: "admin",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      mail: "admin@izis.rs",
      phone: "0601234567",
      role: "admin",
      uniqueMasterCitizenNumber: "1234567890123",
      healthInstitution: institution._id,
      lastLogin: new Date(),
    });

    await user.save();
    console.log("Admin user created!");
    process.exit();
  })
  .catch((err) => {
    console.error("Seeding error:", err);
    process.exit(1);
  });
