import mongoose from "mongoose";

const diagnosticLabCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
   createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const DiagnosticLabCategory = mongoose.model("DiagnosticLabCategory", diagnosticLabCategorySchema);

export default DiagnosticLabCategory;