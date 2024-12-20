import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    ipAddress: { type: String }, // Visitor's IP Address
    userAgent: { type: String }, // Browser User-Agent
    referrer: { type: String, required: false }, // Referring URL
    page: { type: String }, // Page visited
    timestamp: { type: Date, default: Date.now }, // When the visit happened
  },
  { timestamps: true } // Auto add createdAt and updatedAt
);

export default mongoose.models.Visit || mongoose.model("Visit", visitSchema);
