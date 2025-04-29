import mongoose from "mongoose";

const healthInstitutionSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "dateCreated" },
  }
);

export default mongoose.model("HealthInstitution", healthInstitutionSchema);
