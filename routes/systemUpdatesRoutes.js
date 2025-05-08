// Import the Express framework to create routes
import express from "express";

// Import controller functions from the systemUpdatesController
// Each function handles a specific system-updates-related operation
import {
  getSystemUpdates, // Fetches all system updates, with pagination support
} from "../controllers/systemUpdatesController.js";

// Create a new Express Router instance for defining system-updates-related routes
const router = express.Router();

// Route to retrieve a paginated list of all reference pages (GET /system-updates)
router.get("/", getSystemUpdates);

// Export the router so it can be mounted in the main app (e.g., app.use("/system-updates", router))
export default router;
