// Import the User model from the models directory
import User from "../models/User.js"; // Adjust the path if necessary

// Fetches paginated, filtered, and sorted user data
export const getUserData = async (query, page, limit, sortBy, sortOrder) => {
  // Calculate how many documents to skip based on the current page
  const skip = (page - 1) * limit;

  // Use an empty string if no search query is provided
  const searchQuery = query || "";

  // Build a search condition using regex for case-insensitive partial matching
  // This will search for the keyword in username, firstName, lastName, or mail fields
  const searchCondition = {
    $or: [
      { username: { $regex: searchQuery, $options: "i" } },
      { firstName: { $regex: searchQuery, $options: "i" } },
      { lastName: { $regex: searchQuery, $options: "i" } },
      { mail: { $regex: searchQuery, $options: "i" } },
    ],
  };

  // Dynamically build the sort object
  // Example: { firstName: 1 } for ascending or { lastLogin: -1 } for descending
  const sort = {};
  if (sortBy) {
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;
  }

  // Perform the user query and count in parallel for efficiency
  const [users, total] = await Promise.all([
    User.find(searchCondition) // Apply search condition
      .skip(skip) // Skip users for pagination
      .limit(limit) // Limit results to the current page
      .populate("healthInstitution") // Populate healthInstitution reference
      .sort(sort), // Apply sorting dynamically
    User.countDocuments(searchCondition), // Count matching documents
  ]);

  // Calculate total number of pages based on result count and limit
  const totalPages = Math.ceil(total / limit);

  // Return the fetched user list along with pagination metadata
  return { users, total, totalPages, searchQuery };
};
