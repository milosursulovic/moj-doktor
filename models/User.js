// Import the mongoose library for defining MongoDB schemas and models
import mongoose from "mongoose";

// Define the schema for a User document
const userSchema = new mongoose.Schema(
  {
    // Unique username for login and identification
    username: { type: String, required: true, unique: true },

    // Hashed password (required)
    password: { type: String, required: true },

    // User's first and last name (both required)
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },

    // Unique email address (required)
    mail: { type: String, required: true, unique: true },

    // Optional phone number
    phone: { type: String },

    // Role must be one of the defined options; default is "admin"
    role: { type: String, enum: ["admin", "doc", "nurse"], default: "admin" },

    // Unique Master Citizen Number (e.g. JMBG) — must be unique and is required
    uniqueMasterCitizenNumber: { type: String, required: true, unique: true },

    // Tracks the last time the user logged in
    lastLogin: { type: Date },

    // Reference to the associated health institution (foreign key)
    healthInstitution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HealthInstitution", // References the HealthInstitution model
    },
  },
  {
    // Automatically add timestamps for creation and last update
    timestamps: { createdAt: "dateCreated", updatedAt: "updatedAt" },
  }
);

// Export the User model based on the schema for use in the application
export default mongoose.model("User", userSchema);
