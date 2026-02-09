import mongoose from "mongoose";

const dietitianSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DietitianCategory",
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
  about:{
    type: String,
    required: true,
  },
  amenities:[
    {
      type: String,
      required: false,
    }
  ],
  isActive: {
    type: Boolean,
    default: false,
  },
  dietitianCoverImg: {
    type: String,  // Cloudinary URL of the main image
    required: false,
    default: "",
  },
  dietitianImg: [
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



const Dietitian = mongoose.model("Dietitian", dietitianSchema);

export default Dietitian;
