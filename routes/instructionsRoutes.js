// Import the Express framework to create routes
import express from "express";

// Import controller functions from the instructionsController
// Each function handles a specific instructions-related operation
import {
  getInstructions, // Fetches all instructions, with pagination support
} from "../controllers/instructionsController.js";

// Create a new Express Router instance for defining instructions-related routes
const router = express.Router();

// Route to retrieve a paginated list of all instructions (GET /instructions)
router.get("/", getInstructions);

// Export the router so it can be mounted in the main app (e.g., app.use("/instructions", router))
export default router;
