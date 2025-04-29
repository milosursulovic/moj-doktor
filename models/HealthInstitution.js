import mongoose from "mongoose";

const healthInstitutionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "dateCreated" },
  }
);

export default mongoose.model("HealthInstitution", healthInstitutionSchema);
