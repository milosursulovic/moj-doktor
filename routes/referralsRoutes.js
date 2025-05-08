// Import the Express framework to create routes
import express from "express";

// Import controller functions from the referralsController
// Each function handles a specific referral-related operation
import {
  getReferrals, // Fetches all referrals, with pagination support
} from "../controllers/referralsController.js";

// Create a new Express Router instance for defining referrals-related routes
const router = express.Router();

// Route to retrieve a paginated list of all referrals (GET /referrals)
router.get("/", getReferrals);

// Export the router so it can be mounted in the main app (e.g., app.use("/referrals", router))
export default router;
