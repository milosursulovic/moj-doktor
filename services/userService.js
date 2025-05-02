// Import the User model from the models directory
import User from "../models/User.js"; // adjust path if needed

// Fetches paginated and optionally filtered user data
export const getUserData = async (query, page, limit) => {
  // Calculate how many users to skip based on the current page
  const skip = (page - 1) * limit;

  // Default to empty string if no search query is provided
  const searchQuery = query || "";

  // Build a MongoDB search condition with case-insensitive partial matching
  const searchCondition = {
    $or: [
      { username: { $regex: searchQuery, $options: "i" } },
      { firstName: { $regex: searchQuery, $options: "i" } },
      { lastName: { $regex: searchQuery, $options: "i" } },
      { mail: { $regex: searchQuery, $options: "i" } },
    ],
  };

  // Fetch users and total count in parallel
  const [users, total] = await Promise.all([
    // Query users matching the search condition
    User.find(searchCondition)
      .skip(skip) // Skip users for pagination
      .limit(limit) // Limit the number of users returned
      .populate("healthInstitution") // Populate the healthInstitution field with referenced data
      .sort({ lastLogin: -1 }), // Sort users by last login date in descending order

    // Count total users matching the search condition
    User.countDocuments(searchCondition),
  ]);

  // Calculate total number of pages
  const totalPages = Math.ceil(total / limit);

  // Return user data and pagination info
  return { users, total, totalPages, searchQuery };
};
