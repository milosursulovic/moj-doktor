// Import the Express framework
import express from "express";

// Import controller functions for handling user-related operations
import {
  addUser, // Function to add a new user
  getUsers, // Function to get a list of users (with pagination or filtering)
  getUser, // Function to get a single user by ID
  modifyUser, // Function to update a user's information
  changeRole, // Function to update a user's role
} from "../controllers/usersController.js";

// Create a new router instance
const router = express.Router();

// Define route for rendering the add user form (GET /users/add-user)
router.get("/add-user", (req, res) => {
  res.render("add-user");
});

// Define route for adding a new user (POST /users)
router.post("/", addUser);

// Define route for retrieving all users (GET /users)
router.get("/", getUsers);

// Define route for retrieving a specific user by ID (GET /users/:id)
router.get("/:id", getUser);

// Define route for rendering the edit user form (GET /users/edit-user/:id)
router.get("/edit-user/:id", (req, res) => {
  const userId = req.params.id;
  res.render("edit-user", { userId });
});

// Define route for updating user data (PATCH /users/:id)
router.patch("/:id", modifyUser);

// Define route for rendering the manage role form (GET /users/manage-role/:id)
router.get("/manage-roles/:id", (req, res) => {
  const userId = req.params.id;
  res.render("manage-roles", { userId });
});

// Define route for changing a user's role (PATCH /users/:id/role)
router.patch("/:id/role", changeRole);

// Export the router to be used in the main app
export default router;
