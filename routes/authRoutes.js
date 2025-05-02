// Import the Express framework to create routes
import express from "express";

import { isLoggedIn } from "../middlewares/auth.js"; // Middleware for checking if user is logged in

// Import controller functions from the authController
// Each function handles a specific user-related operation
import {
  getLogin, // Renders the login page
  logout, // Handles user logout
} from "../controllers/authController.js";

import passport from "passport"; // Middleware for authentication

// Create a new Express Router instance for defining user-related routes
const router = express.Router();

// Render login page if user is not already logged in
router.get("/login", isLoggedIn, getLogin);

// Handle login form submission, use passport authentication
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/users", // Redirect to the users page upon successful login
    failureRedirect: "/auth/login", // Redirect back to login page upon failure
  })
);

// Logout route, invalidates the session
router.get("/logout", logout);

// Export the router so it can be mounted in the main app (e.g., app.use("/auth", router))
export default router;
