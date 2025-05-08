// Import the Express framework to create routes
import express from "express";

// Import controller functions from the calendarController
// Each function handles a specific referral-related operation
import {
  getCalendar, // Fetches all calendar, with pagination support
} from "../controllers/calendarController.js";

// Create a new Express Router instance for defining calendar-related routes
const router = express.Router();

// Route to retrieve a paginated list of all calendar (GET /calendar)
router.get("/", getCalendar);

// Export the router so it can be mounted in the main app (e.g., app.use("/calendar", router))
export default router;
