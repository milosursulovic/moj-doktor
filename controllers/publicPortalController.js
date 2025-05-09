// Renders EJS view with paginated and filtered user data
export const getPublicPortal = async (req, res) => {
  try {

    // Render the EJS template 'index.ejs' of public portal
    res.render("public-portal/index");
  } catch (error) {
    // Handle errors (e.g., DB failure) by returning a 500 Internal Server Error
    res.status(500).json({ msg: error.message });
  }
};