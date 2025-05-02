// Import required modules
import mongoose from "mongoose"; // For connecting to MongoDB and working with models
import dotenv from "dotenv"; // To load environment variables from a .env file
import bcrypt from "bcrypt"; // For hashing passwords securely
import User from "../models/User.js"; // Mongoose model for the User collection
import HealthInstitution from "../models/HealthInstitution.js"; // Model for health institutions

dotenv.config(); // Load environment variables from .env file

// Connect to MongoDB using the connection string from the environment variables
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("MongoDB connected. Seeding data...");

    // Create a health institution to associate users with (optional seed data)
    const institution = new HealthInstitution({ name: "KBC Zemun" });
    await institution.save();

    // Hash the password for the admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create and save the main admin user with relevant fields
    const adminUser = new User({
      username: "admin",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      mail: "admin@izis.rs",
      phone: "0601234567",
      role: "admin",
      uniqueMasterCitizenNumber: "1234567890123",
      healthInstitution: institution._id, // Reference to the health institution
      lastLogin: new Date(), // Set the last login time to now
    });

    await adminUser.save(); // Save the admin user to the database
    console.log("Admin user created!");

    // Utility function to randomly assign a role to generated users
    const getRandomRole = () => {
      const roles = ["admin", "doc", "nurse"];
      const randomIndex = Math.floor(Math.random() * roles.length);
      return roles[randomIndex];
    };

    // Prepare promises to create 19 additional users with varying roles
    const userPromises = [];
    for (let i = 1; i <= 19; i++) {
      // Hash password for each user
      const hashedUserPassword = await bcrypt.hash(`user${i}password`, 10);

      // Create a user object
      const user = new User({
        username: `user${i}`,
        password: hashedUserPassword,
        firstName: `User${i}`,
        lastName: `Test`,
        mail: `user${i}@example.com`,
        phone: `06012345${i}`,
        role: getRandomRole(), // Randomly assign role
        uniqueMasterCitizenNumber: `9876543210${i}`,
        healthInstitution: institution._id,
        lastLogin: new Date(),
      });

      // Add the save promise to the array
      userPromises.push(user.save());
    }

    // Execute all user creation promises in parallel
    await Promise.all(userPromises);
    console.log("19 users created with random roles!");

    process.exit(); // Exit the script successfully
  })
  .catch((err) => {
    // Handle errors during the database connection or seeding
    console.error("Seeding error:", err);
    process.exit(1); // Exit with an error status
  });
