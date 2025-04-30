// Import the Express framework
import express from "express";

// Import controller functions for handling user-related operations
import {
  addUser,      // Function to add a new user
  getUsers,     // Function to get a list of users (with pagination or filtering)
  getUser,      // Function to get a single user by ID
  modifyUser,   // Function to update a user's information
  changeRole    // Function to update a user's role
} from "../controllers/usersController.js";

// Create a new router instance
const router = express.Router();

// Define route for adding a new user (POST /api/users)
router.post("/", addUser);

// Define route for retrieving all users (GET /api/users)
router.get("/", getUsers);

// Define route for retrieving a specific user by ID (GET /api/users/:id)
router.get("/:id", getUser);

// Define route for updating user data (PATCH /api/users/:id)
router.patch("/:id", modifyUser);

// Define route for changing a user's role (PATCH /api/users/:id/role)
router.patch("/:id/role", changeRole);

// Export the router to be used in the main app
export default router;
