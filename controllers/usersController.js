import bcrypt from "bcrypt";
import User from "../models/User.js";
import HealthInstitution from "../models/HealthInstitution.js";

//Add a new user
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

    // Basic validation (you can add more robust validation)
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

    // Check if username or email or uniqueMasterCitizenNumber already exist
    const existingUser = await User.findOne({
      $or: [{ username }, { mail }, { uniqueMasterCitizenNumber }],
    });

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (existingUser) {
      return res
        .status(409)
        .json({ msg: "User with provided credentials already exists." });
    }

    // Find or create health institution
    let healthInstitution = await HealthInstitution.findOne({
      name: "Zdravstveni centar Negotin, Opšta bolnica Bor",
    });
    if (!healthInstitution) {
      healthInstitution = new HealthInstitution({
        name: "Zdravstveni centar Negotin, Opšta bolnica Bor",
      });
      await healthInstitution.save();
    }

    // Create and save the new user
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
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get user by id
export const getUser = async (req, res) => {
  try {
    // Retrieve the user ID from the URL parameters
    const { id } = req.params;

    // Find the user in the database using the provided ID
    const user = await User.findById(id);

    // If the user is not found, return an error
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Return the user's data
    res.json(user);
  } catch (error) {
    // Return an error message if something goes wrong
    res.status(500).json({ msg: error.message });
  }
};

// Get all users with pagination
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // default to page 1
    const limit = parseInt(req.query.limit) || 10; // default to 10 users per page

    const skip = (page - 1) * limit;

    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .populate("healthInstitution")
      .sort({ lastLogin: -1 });

    const total = await User.countDocuments();

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

//Modify user
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
    } = req.body;

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
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "Korisnik nije pronađen" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//Change role
export const changeRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ msg: "Nedostaje nova uloga." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "Korisnik nije pronađen." });
    }

    res.status(200).json({ msg: "Uloga uspešno promenjena.", user: updatedUser });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};