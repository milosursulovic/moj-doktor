import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mail: { type: String, required: true, unique: true },
    phone: { type: String },
    role: { type: String, enum: ["admin", "doc", "nurse"], default: "admin" },
    uniqueMasterCitizenNumber: { type: String, required: true, unique: true },
    lastLogin: { type: Date },
    healthInstitution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HealthInstitution",
    },
  },
  {
    timestamps: { createdAt: "dateCreated", updatedAt: "updatedAt" },
  }
);

export default mongoose.model("User", userSchema);
