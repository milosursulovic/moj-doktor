// Import required modules
import express from "express"; // Web framework for handling HTTP requests
import mongoose from "mongoose"; // MongoDB ODM (Object Data Modeling) library
import cors from "cors"; // Middleware for enabling Cross-Origin Resource Sharing
import bodyParser from "body-parser"; // Middleware for parsing incoming JSON requests
import usersRoutes from "./routes/usersRoutes.js"; // Import custom user routes handlers
import loginRoutes from "./routes/auth/loginRoutes.js"; // Import login routes handlers
import logoutRoutes from "./routes/auth/logoutRoutes.js"; // Import logout routes handlers
import referralsRoutes from "./routes/referralsRoutes.js"; // Import referrals routes handlers
import calendarRoutes from "./routes/calendarRoutes.js"; // Import calendar routes handlers
import referencePagesRoutes from "./routes/referencePagesRoutes.js"; // Import referencePages routes handlers
import dotenv from "dotenv"; // Loads environment variables from a .env file
import bcrypt from "bcrypt"; // Library for hashing passwords
import User from "./models/User.js"; // Import User model
import passport from "passport"; // Middleware for authentication
import { Strategy as LocalStrategy } from "passport-local"; // Local authentication strategy
import session from "express-session"; // Middleware for managing sessions

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();

// Set the port to environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Set the view engine to EJS (Embedded JavaScript) for rendering views
app.set("view engine", "ejs");
app.set("views", "./views"); // Specify the directory for view files

// Enable Cross-Origin requests for all routes (to allow requests from different domains)
app.use(cors());

// Automatically parse JSON bodies from incoming requests
app.use(bodyParser.json());

// Automatically parse URL-encoded bodies from incoming requests (useful for form submissions)
app.use(bodyParser.urlencoded({ extended: true }));

// Set up session and passport middleware to manage sessions and user authentication
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret", // Secret for signing the session ID cookie
    resave: false, // Don't resave session if it's not modified
    saveUninitialized: false, // Don't save uninitialized sessions
  })
);

app.use(passport.initialize()); // Initialize passport for authentication handling
app.use(passport.session()); // This allows passport to persist session across requests

// Configure LocalStrategy for local username/password authentication
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Check if a user with the given username exists
      const user = await User.findOne({ username });
      if (!user) return done(null, false, { message: "Incorrect username" });

      // Compare the provided password with the stored hashed password
      const match = await bcrypt.compare(password, user.password);
      if (!match) return done(null, false, { message: "Incorrect password" });

      // Authentication succeeded, return the user object
      return done(null, user);
    } catch (err) {
      // Handle any errors during authentication
      console.error("Error during authentication:", err);
      return done(err);
    }
  })
);

// Serialize user into the session (store user ID)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session using the stored user ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Retrieve user from the database by ID
    done(null, user); // Attach user to the session
  } catch (err) {
    console.error("Error deserializing user:", err);
    done(err);
  }
});

// Mount login route under "/login"
app.use("/login", loginRoutes);

// Mount logout route under "/logout"
app.use("/logout", logoutRoutes);

// Mount user-related routes under the "/users" path
app.use("/users", usersRoutes);

// Mount referrals-related routes under the "/referrals" path
app.use("/referrals", referralsRoutes);

// Mount calendar-related routes under the "/calendar" path
app.use("/calendar", calendarRoutes);

// Mount reference-pages-related routes under the "/reference-pages" path
app.use("/reference-pages", referencePagesRoutes);

// Catch-all route for undefined routes
app.use((req, res) => {
  if (req.isAuthenticated()) {
    // If logged in, redirect to '/users'
    res.redirect("/users");
  } else {
    // If not logged in, redirect to the login page
    res.redirect("/login");
  }
});

// Connect to MongoDB using the connection string from the .env file
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    // If connection is successful, start the Express server
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    // If the connection fails, log the error and exit the process
    console.error("Error connecting to MongoDB:", error);
  });
