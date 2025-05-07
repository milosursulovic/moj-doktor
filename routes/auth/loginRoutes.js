// Import the Express framework to create routes
import express from "express";

import { isLoggedIn } from "../../middlewares/auth.js"; // Middleware for checking if user is logged in

// Import controller functions from the authController
// Each function handles a specific user-related operation
import {
  getLogin, // Renders the login page
  handleLogin, // Handles the login form submission
} from "../../controllers/authController.js";

// Create a new Express Router instance for defining user-related routes
const router = express.Router();

// Render login page if user is not already logged in
router.get("/", isLoggedIn, getLogin);

// Handle login form submission using handleLogin from the controller
router.post("/", isLoggedIn, handleLogin);

// Export the router so it can be mounted in the main app (e.g., app.use("/auth", router))
export default router;
