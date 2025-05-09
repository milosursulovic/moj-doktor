// Renders EJS view with paginated and filtered user data
export const getCalendar = async (req, res) => {
  try {

    // Render the EJS template 'index.ejs' of calendar
    res.render("calendar/index", {
      user: req.user, // Authenticated user info (if available)
    });
  } catch (error) {
    // Handle errors (e.g., DB failure) by returning a 500 Internal Server Error
    res.status(500).json({ msg: error.message });
  }
};