// Import required modules
import express from "express"; // Web framework for handling HTTP requests
import mongoose from "mongoose"; // MongoDB ODM (Object Data Modeling) library
import cors from "cors"; // Middleware for enabling Cross-Origin Resource Sharing
import bodyParser from "body-parser"; // Middleware for parsing incoming JSON requests
import usersRoutes from "./routes/usersRoutes.js"; // Import custom user route handlers
import dotenv from "dotenv"; // Loads environment variables from a .env file

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

// Serve static files from the "public" folder (e.g. frontend assets)
app.use(express.static("public"));

// Render login page
app.get("/login", (req, res) => {
  // Render the login page
  res.render("login");
});

// Mount the user routes under the /api/users path
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
