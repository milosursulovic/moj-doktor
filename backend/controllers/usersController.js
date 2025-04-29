import User from "../models/User.js";

//Add a new user
export const addUser = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get all users with pagination
export const getUsers = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//Modify user
export const modifyUser = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
