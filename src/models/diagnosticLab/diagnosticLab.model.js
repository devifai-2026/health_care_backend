import mongoose from "mongoose";

const diagnosticLabSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DiagnosticLabCategory",
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    default: null,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  specialties: [
    {
      type: String,
      required: true,
    },
  ],
  isActive: {
    type: Boolean,
    default: false,
  },
  diagnosticLabCoverImg: {
    type: String,  // Cloudinary URL of the main image
    required: false,
    default: "",
  },
  diagnosticLabImg: [
    {
      type: String, // Cloudinary URL of the sub image
    },
  ],
   createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});



const DiagnosticLab = mongoose.model("DiagnosticLab", diagnosticLabSchema);

export default DiagnosticLab;
