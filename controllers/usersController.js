// Import necessary modules
import bcrypt from "bcrypt"; // For hashing user passwords
import User from "../models/User.js"; // User model from database schema
import HealthInstitution from "../models/HealthInstitution.js"; // Health institution model
import { getUserData } from "../services/userService.js"; // Service for user data retrieval

// Render the form to add a new user
export const getAddUser = (req, res) => {
  res.render("add-user"); // Renders the 'add-user' EJS template
};

// Handle logic for adding a new user
export const addUser = async (req, res) => {
  try {
    // Destructure fields from the request body
    const {
      username,
      password,
      firstName,
      lastName,
      mail,
      phone,
      role,
      uniqueMasterCitizenNumber,
    } = req.body;

    // Validate that all required fields are provided
    if (
      !username ||
      !password ||
      !firstName ||
      !lastName ||
      !mail ||
      !uniqueMasterCitizenNumber
    ) {
      return res.status(400).json({ msg: "Missing required fields." });
    }

    // Check if user with same username, email, or ID number already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { mail }, { uniqueMasterCitizenNumber }],
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ msg: "User with provided credentials already exists." });
    }

    // Hash the password before saving the user
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Try to find the default health institution
    let healthInstitution = await HealthInstitution.findOne({
      name: "Zdravstveni centar Negotin, Opšta bolnica Bor",
    });

    // If not found, create and save it
    if (!healthInstitution) {
      healthInstitution = new HealthInstitution({
        name: "Zdravstveni centar Negotin, Opšta bolnica Bor",
      });
      await healthInstitution.save();
    }

    // Create a new user object
    const newUser = new User({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      mail,
      phone,
      role,
      uniqueMasterCitizenNumber,
      lastLogin: new Date(),
      healthInstitution: healthInstitution._id,
    });

    // Save the new user to the database
    await newUser.save();

    // Redirect to user list page
    res.redirect("/users");
  } catch (error) {
    res.status(500).json({ msg: error.message }); // Handle server errors
  }
};

// Fetch a specific user by ID
export const getUser = async (req, res) => {
  try {
    const { id } = req.params; // Extract user ID from URL
    const user = await User.findById(id); // Find user by ID

    if (!user) {
      return res.status(404).json({ msg: "User not found" }); // Return 404 if not found
    }

    res.json(user); // Return user data as JSON
  } catch (error) {
    res.status(500).json({ msg: error.message }); // Handle server errors
  }
};

// Renders EJS view with paginated and filtered user data
export const getUsers = async (req, res) => {
  try {
    // Parse pagination parameters from query string, with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Retrieve user data based on search query, page, and limit
    const { users, total, totalPages, searchQuery } = await getUserData(
      req.query.query,
      page,
      limit
    );

    // Render the "index" EJS template with the retrieved data
    res.render("index", {
      user: req.user, // Authenticated user (if any)
      users, // List of users for current page
      currentPage: page, // Current page number
      totalPages, // Total number of pages
      totalUsers: total, // Total number of matched users
      searchQuery, // The search term used (if any)
    });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ msg: error.message });
  }
};

// Returns user data as JSON (for frontend AJAX calls)
export const getUsersSearch = async (req, res) => {
  try {
    // Parse pagination parameters from query string, with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Retrieve user data based on search query, page, and limit
    const { users, total, totalPages, searchQuery } = await getUserData(
      req.query.query,
      page,
      limit
    );

    // Respond with user data in JSON format
    res.json({
      user: req.user, // Authenticated user (if any)
      users, // List of users for current page
      currentPage: page, // Current page number
      totalPages, // Total number of pages
      totalUsers: total, // Total number of matched users
      searchQuery, // The search term used (if any)
    });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ msg: error.message });
  }
};

// Render the edit user form with current user data
export const getEditUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    res.render("edit-user", { user }); // Pass user data to the form
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Handle editing of user data
export const editUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const {
      username,
      firstName,
      lastName,
      mail,
      phone,
      role,
      uniqueMasterCitizenNumber,
      password,
    } = req.body;

    // Prepare the update object
    const updateData = {
      username,
      firstName,
      lastName,
      mail,
      phone,
      role,
      uniqueMasterCitizenNumber,
    };

    // If a new password is provided, hash and update it
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Update the user by ID
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true, // Return the updated document
    });

    if (!updatedUser) {
      return res.status(404).json({ msg: "Korisnik nije pronađen" }); // Not found
    }

    res.status(200).json(updatedUser); // Return updated user
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Render the page for managing user roles
export const getManageRoles = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "Korisnik nije pronađen." });
    }

    res.render("manage-roles", { user }); // Render role management view
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Handle updating a user's role
export const manageRoles = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    // Validate new role
    if (!role) {
      return res.status(400).json({ msg: "Nedostaje nova uloga." });
    }

    // Update user's role in the DB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "Korisnik nije pronađen." });
    }

    res
      .status(200)
      .json({ msg: "Uloga uspešno promenjena.", user: updatedUser }); // Success message
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
