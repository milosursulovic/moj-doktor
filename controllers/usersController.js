// Import necessary modules
import bcrypt from "bcrypt"; // For password hashing
import User from "../models/User.js"; // User model
import HealthInstitution from "../models/HealthInstitution.js"; // Health Institution model

// Add a new user
export const addUser = async (req, res) => {
  try {
    // Destructure user data from the request body
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

    // Validate required fields
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

    // Check for existing user with same username, email, or ID number
    const existingUser = await User.findOne({
      $or: [{ username }, { mail }, { uniqueMasterCitizenNumber }],
    });

    // Hash the user's password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // If a user with the same credentials exists, respond with conflict
    if (existingUser) {
      return res
        .status(409)
        .json({ msg: "User with provided credentials already exists." });
    }

    // Find or create a default Health Institution
    let healthInstitution = await HealthInstitution.findOne({
      name: "Zdravstveni centar Negotin, Opšta bolnica Bor",
    });
    if (!healthInstitution) {
      healthInstitution = new HealthInstitution({
        name: "Zdravstveni centar Negotin, Opšta bolnica Bor",
      });
      await healthInstitution.save();
    }

    // Create a new user instance with hashed password and default health institution
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
  } catch (error) {
    // Return a server error message if something fails
    res.status(500).json({ msg: error.message });
  }
};

// Get user by ID
export const getUser = async (req, res) => {
  try {
    // Get user ID from the request parameters
    const { id } = req.params;

    // Find the user by ID
    const user = await User.findById(id);

    // If not found, return 404 error
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Return user data
    res.json(user);
  } catch (error) {
    // Return server error message
    res.status(500).json({ msg: error.message });
  }
};

// Get all users with pagination support
export const getUsers = async (req, res) => {
  try {
    // Parse page and limit from query, defaulting if not provided
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate how many users to skip for pagination
    const skip = (page - 1) * limit;

    // Find users, populate their health institution, sort by last login
    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .populate("healthInstitution")
      .sort({ lastLogin: -1 });

    // Get total user count
    const total = await User.countDocuments();

    // Return paginated result
    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Modify an existing user's data
export const modifyUser = async (req, res) => {
  try {
    // Get user ID from request params
    const userId = req.params.id;

    // Extract updated user data from request body
    const {
      username,
      firstName,
      lastName,
      mail,
      phone,
      role,
      uniqueMasterCitizenNumber,
    } = req.body;

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        firstName,
        lastName,
        mail,
        phone,
        role,
        uniqueMasterCitizenNumber,
      },
      { new: true } // Return the updated document
    );

    // If user not found, return 404
    if (!updatedUser) {
      return res.status(404).json({ msg: "Korisnik nije pronađen" });
    }

    // Return updated user data
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Change a user's role
export const changeRole = async (req, res) => {
  try {
    // Get user ID from request params
    const userId = req.params.id;

    // Get new role from request body
    const { role } = req.body;

    // Validate role input
    if (!role) {
      return res.status(400).json({ msg: "Nedostaje nova uloga." });
    }

    // Update user's role
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    // If user not found, return 404
    if (!updatedUser) {
      return res.status(404).json({ msg: "Korisnik nije pronađen." });
    }

    // Return success message with updated user
    res.status(200).json({ msg: "Uloga uspešno promenjena.", user: updatedUser });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
