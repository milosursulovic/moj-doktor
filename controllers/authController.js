export const getLogin = (req, res) => {
  res.render("login"); // Render the login page
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Failed to log out"); // Handle logout errors
    }
    res.redirect("/auth/login"); // Redirect to login page after successful logout
  });
};
