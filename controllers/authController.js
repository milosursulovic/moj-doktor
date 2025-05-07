import passport from "passport"; // Import the passport library for authentication

// Handle GET request to show the login page
export const getLogin = (req, res) => {
  res.render("login"); // Render the login page template
};

// Function to handle login and update lastLogin
export const handleLogin = async (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      return next(err); // Handle any internal errors
    }
    if (!user) {
      return res.redirect("/login"); // Redirect to login if authentication fails
    }

    // Log the user in by attaching the user to the session
    req.login(user, async (err) => {
      if (err) {
        return next(err); // Handle errors during login
      }

      try {
        // Update the user's lastLogin field with the current date
        user.lastLogin = new Date();
        await user.save();

        // Redirect to the users page upon successful login and lastLogin update
        return res.redirect("/users");
      } catch (error) {
        console.error("Error updating lastLogin:", error);
        return res.status(500).send("Error updating login time");
      }
    });
  })(req, res, next); // Call the passport.authenticate function manually
};

// Handle logout request
export const logout = (req, res) => {
  // Attempt to log the user out
  req.logout((err) => {
    if (err) {
      // If there's an error during logout, send a 500 status with an error message
      return res.status(500).send("Failed to log out");
    }
    // If logout is successful, redirect the user to the login page
    res.redirect("/login");
  });
};
