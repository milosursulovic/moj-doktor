// Import the Express framework to create routes
import express from "express";

// Import controller functions from the authController
// Each function handles a specific user-related operation
import {
  logout, // Handles user logout
} from "../../controllers/authController.js";

// Create a new Express Router instance for defining user-related routes
const router = express.Router();

// Logout route, invalidates the session
router.get("/", logout);

// Export the router so it can be mounted in the main app (e.g., app.use("/auth", router))
export default router;
