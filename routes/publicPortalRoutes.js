// Import the Express framework to create routes
import express from "express";

// Import controller functions from the publicPortalController
// Each function handles a specific public-portal-related operation
import {
  getPublicPortal, // Fetches public portal, with pagination support
} from "../controllers/publicPortalController.js";

// Create a new Express Router instance for defining calendar-related routes
const router = express.Router();

// Route to retrieve calendar (GET /public-portal)
router.get("/", getPublicPortal);

// Export the router so it can be mounted in the main app (e.g., app.use("/public-portal", router))
export default router;
