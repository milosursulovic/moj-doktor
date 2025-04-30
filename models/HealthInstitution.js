// Import the mongoose library for MongoDB object modeling
import mongoose from "mongoose";

// Define a schema for a health institution
const healthInstitutionSchema = new mongoose.Schema(
  {
    // Each health institution must have a name (required string)
    name: { type: String, required: true },
  },
  {
    // Automatically add a timestamp for when the document is created
    timestamps: { createdAt: "dateCreated" }, // No updatedAt timestamp is included
  }
);

// Export the model to be used in other parts of the app
export default mongoose.model("HealthInstitution", healthInstitutionSchema);
