import mongoose from "mongoose";

const elderCareOrgSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ElderCareOrgCategory",
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
  elderCareOrgCoverImg: {
    type: String,  // Cloudinary URL of the main image
    required: false,
    default: "",
  },
  elderCareOrgImg: [
    {
      type: String, // Cloudinary URL of the sub image
    },
  ],
});



const ElderCareOrg = mongoose.model("ElderCareOrg", elderCareOrgSchema);

export default ElderCareOrg;
