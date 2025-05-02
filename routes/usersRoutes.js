// Import the Express framework
import express from "express";

// Import controller functions for handling user-related operations
import {
  getAddUser, // Function to render the add user form
  addUser, // Function to add a new user
  getUsers, // Function to get a list of users (with pagination or filtering)
  getUser, // Function to get a single user by ID
  getEditUser, // Function to render the edit user form
  editUser, // Function to update a user's information
  getManageRoles, // Function to render the manage role form
  manageRoles, // Function to update a user's role
} from "../controllers/usersController.js";
import { isAuthenticated } from "../middlewares/auth.js"; // Middleware to check if user is authenticated

// Create a new router instance
const router = express.Router();

router.use(isAuthenticated); // Apply authentication middleware to all routes

// Define route for rendering the add user form (GET /users/add-user)
router.get("/add-user", getAddUser);

// Define route for adding a new user (POST /users)
router.post("/", addUser);

// Define route for retrieving all users (GET /users)
router.get("/", getUsers);

// Define route for retrieving a specific user by ID (GET /users/:id)
router.get("/:id", getUser);

// Define route for rendering the edit user form (GET /users/edit-user/:id)
router.get("/edit-user/:id", getEditUser);

// Define route for updating user data (PATCH /users/:id)
router.patch("/:id", editUser);

// Define route for rendering the manage role form (GET /users/manage-role/:id)
router.get("/manage-roles/:id", getManageRoles);

// Define route for changing a user's role (PATCH /users/:id/role)
router.patch("/:id/role", manageRoles);

// Export the router to be used in the main app
export default router;
