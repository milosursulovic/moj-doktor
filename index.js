// Import required modules
import express from "express"; // Web framework for handling HTTP requests
import mongoose from "mongoose"; // MongoDB ODM (Object Data Modeling) library
import cors from "cors"; // Middleware for enabling Cross-Origin Resource Sharing
import bodyParser from "body-parser"; // Middleware for parsing incoming JSON requests
import usersRoutes from "./routes/usersRoutes.js"; // Import custom user route handlers
import dotenv from "dotenv"; // Loads environment variables from a .env file
import bcrypt from "bcrypt"; // Library for hashing passwords
import User from "./models/User.js"; // Import User model
import passport from "passport"; // Middleware for authentication
import { Strategy as LocalStrategy } from "passport-local"; // Local authentication strategy
import session from "express-session"; // Middleware for managing sessions
import { isLoggedIn } from "./middlewares/auth.js"; // Middleware for checking if user is logged in

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();

// Set the port to environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Set the view engine to EJS (Embedded JavaScript)
app.set("view engine", "ejs");
app.set("views", "./views");

// Enable Cross-Origin requests for all routes
app.use(cors());

// Automatically parse JSON bodies from incoming requests
app.use(bodyParser.json());

// Automatically parse URL-encoded bodies from incoming requests
app.use(bodyParser.urlencoded({ extended: true }));

// Set up session and passport middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret", // Secret for signing the session ID cookie
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session()); // This is what allows passport to persist sessions

// Configure LocalStrategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) return done(null, false, { message: "Incorrect username" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return done(null, false, { message: "Incorrect password" });

      return done(null, user);
    } catch (err) {
      console.error("Error during authentication:", err);
      return done(err);
    }
  })
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    console.error("Error deserializing user:", err);
    done(err);
  }
});

// Render login page
app.get("/login", isLoggedIn, (req, res) => {
  // Render the login page
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/users",
    failureRedirect: "/login",
  })
);

// Logout route
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Failed to log out");
    }
    res.redirect("/login"); // Redirect to the login page after logging out
  });
});

// Mount the user routes under the /users path
app.use("/users", usersRoutes);

// Connect to MongoDB using the connection string from the .env file
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    // If connection succeeds, start the Express server
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    // If connection fails, log the error
    console.error("Error connecting to MongoDB:", error);
  });
