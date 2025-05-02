// Import the Express framework to create routes
import express from "express";

// Import controller functions from the usersController
// Each function handles a specific user-related operation
import {
  getAddUser, // Renders the form to add a new user
  addUser, // Handles creation of a new user (POST)
  getUsers, // Fetches all users, with pagination support
  getUser, // Fetches a single user by their ID
  getEditUser, // Renders the form to edit a specific user's data
  editUser, // Handles updating user data (PATCH)
  getManageRoles, // Renders the form to manage a user's role
  manageRoles, // Handles updating the user's role
} from "../controllers/usersController.js";

// Import middleware that ensures a user is authenticated before accessing the routes
import { isAuthenticated } from "../middlewares/auth.js";

// Create a new Express Router instance for defining user-related routes
const router = express.Router();

// Apply authentication middleware to all routes defined below
// Ensures that only authenticated users can access these routes
router.use(isAuthenticated);

// Route to render the form for adding a new user (GET /users/add-user)
router.get("/add-user", getAddUser);

// Route to handle adding a new user to the system (POST /users)
router.post("/", addUser);

// Route to retrieve a paginated list of all users (GET /users)
router.get("/", getUsers);

// Route to retrieve details of a specific user by ID (GET /users/:id)
router.get("/:id", getUser);

// Route to render the edit form for a specific user (GET /users/edit-user/:id)
router.get("/edit-user/:id", getEditUser);

// Route to handle updating a specific user's data (PATCH /users/:id)
router.patch("/:id", editUser);

// Route to render the form for managing a user's role (GET /users/manage-roles/:id)
router.get("/manage-roles/:id", getManageRoles);

// Route to handle updating a user's role (PATCH /users/:id/role)
router.patch("/:id/role", manageRoles);

// Export the router so it can be mounted in the main app (e.g., app.use("/users", router))
export default router;
