// Import the Express framework to create routes
import express from "express";

// Import controller functions from the referencePagesController
// Each function handles a specific reference-pages-related operation
import {
  getReferencePages, // Fetches all reference pages, with pagination support
} from "../controllers/referencePagesController.js";

// Create a new Express Router instance for defining referencePages-related routes
const router = express.Router();

// Route to retrieve a paginated list of all reference pages (GET /reference-pages)
router.get("/", getReferencePages);

// Export the router so it can be mounted in the main app (e.g., app.use("/reference-pages", router))
export default router;
