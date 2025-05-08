// Renders EJS view with paginated and filtered user data
export const getSystemUpdates = async (req, res) => {
  try {

    // Render the EJS template 'index.ejs' with all relevant system updates and pagination data
    res.render("system-updates/index");
  } catch (error) {
    // Handle errors (e.g., DB failure) by returning a 500 Internal Server Error
    res.status(500).json({ msg: error.message });
  }
};