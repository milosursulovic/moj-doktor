// Authentication middleware
export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    // Or check your session/JWT token
    return next();
  }
  res.redirect("/login");
};

// Redirect if logged in
export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    // Or check your session/JWT token
    return res.redirect("/users"); // Redirect to home/dashboard if already logged in
  }
  next();
};
