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

    // Create the admin user
    const adminUser = new User({
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

    await adminUser.save();
    console.log("Admin user created!");

    // Helper function to randomly choose a role
    const getRandomRole = () => {
      const roles = ["admin", "doc", "nurse"];
      const randomIndex = Math.floor(Math.random() * roles.length);
      return roles[randomIndex];
    };

    // Create 19 more users with random roles
    const userPromises = [];
    for (let i = 1; i <= 19; i++) {
      const hashedUserPassword = await bcrypt.hash(`user${i}password`, 10);
      const user = new User({
        username: `user${i}`,
        password: hashedUserPassword,
        firstName: `User${i}`,
        lastName: `Test`,
        mail: `user${i}@example.com`,
        phone: `06012345${i}`,
        role: getRandomRole(), // Assign a random role
        uniqueMasterCitizenNumber: `9876543210${i}`,
        healthInstitution: institution._id,
        lastLogin: new Date(),
      });

      userPromises.push(user.save());
    }

    await Promise.all(userPromises);
    console.log("19 users created with random roles!");

    process.exit();
  })
  .catch((err) => {
    console.error("Seeding error:", err);
    process.exit(1);
  });
