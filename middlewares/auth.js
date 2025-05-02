// Authentication middleware

// Middleware to check if the user is authenticated (logged in)
export const isAuthenticated = (req, res, next) => {
  // If user is authenticated (typically checked via session or Passport.js helper)
  if (req.isAuthenticated()) {
    // Proceed to the next middleware or route handler
    return next();
  }
  // If not authenticated, redirect to the login page
  res.redirect("/auth/login");
};

// Middleware to redirect users who are already logged in
export const isLoggedIn = (req, res, next) => {
  // If user is already authenticated
  if (req.isAuthenticated()) {
    // Redirect to the user list or dashboard to prevent accessing login/register again
    return res.redirect("/users");
  }
  // If not authenticated, proceed to the requested page (e.g., login)
  next();
};
