// Import the Express framework to create routes
import express from "express";

// Import controller functions from the documentUploadController
// Each function handles a specific document-upload-related operation
import {
  getDocumentUpload, // Fetches document upload
} from "../controllers/documentUploadController.js";

// Create a new Express Router instance for defining document-upload-related routes
const router = express.Router();

// Route to retrieve a document upload (GET /document-upload)
router.get("/", getDocumentUpload);

// Export the router so it can be mounted in the main app (e.g., app.use("/document-upload", router))
export default router;
