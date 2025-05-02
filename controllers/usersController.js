// Import necessary modules
import bcrypt from "bcrypt"; // For password hashing
import User from "../models/User.js"; // User model
import HealthInstitution from "../models/HealthInstitution.js"; // Health Institution model

// Add a new user
export const addUser = async (req, res) => {
  try {
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

    if (existingUser) {
      return res
        .status(409)
        .json({ msg: "User with provided credentials already exists." });
    }

    // Hash password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Find or create default health institution
    let healthInstitution = await HealthInstitution.findOne({
      name: "Zdravstveni centar Negotin, Opšta bolnica Bor",
    });

    if (!healthInstitution) {
      healthInstitution = new HealthInstitution({
        name: "Zdravstveni centar Negotin, Opšta bolnica Bor",
      });
      await healthInstitution.save();
    }

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

    await newUser.save();

    // Redirect to the user list after adding a new user
    res.redirect("/users"); // This will reload the page and show the updated user list
  } catch (error) {
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

// This function handles fetching and rendering the users with pagination support.
export const getUsers = async (req, res) => {
  try {
    // Get the current page number from the query parameters, defaulting to page 1 if not provided
    const page = parseInt(req.query.page) || 1;

    // Get the number of users to show per page (limit) from the query parameters, defaulting to 10 if not provided
    const limit = parseInt(req.query.limit) || 10;

    // Calculate how many users to skip based on the current page and limit
    const skip = (page - 1) * limit;

    // Find users from the database with pagination: skip the necessary number of users, limit the result to the specified number,
    // and populate the health institution associated with each user. Sort by last login date (descending).
    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .populate("healthInstitution")
      .sort({ lastLogin: -1 });

    // Get the total number of users in the database to calculate total pages for pagination
    const total = await User.countDocuments();

    // Calculate the total number of pages based on the total users and the number of users per page (limit)
    const totalPages = Math.ceil(total / limit);

    // Render the "index" view with users data, current page, total pages, and total users information,
    // and include the logged-in user from req.user
    res.render("index", {
      user: req.user, // Pass the logged-in user to the template
      users,
      currentPage: page,
      totalPages,
      totalUsers: total,
    });
  } catch (error) {
    // If an error occurs, respond with a 500 status code and the error message
    res.status(500).json({ msg: error.message });
  }
};

// This function handles modifying user data based on the provided user ID and request body.
export const modifyUser = async (req, res) => {
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

    const updateData = {
      username,
      firstName,
      lastName,
      mail,
      phone,
      role,
      uniqueMasterCitizenNumber,
    };

    // Ako je poslata nova lozinka i nije prazna
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ msg: "Korisnik nije pronađen" });
    }

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
    res
      .status(200)
      .json({ msg: "Uloga uspešno promenjena.", user: updatedUser });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
