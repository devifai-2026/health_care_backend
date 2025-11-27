import mongoose from "mongoose";

const medicineShopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MedicineShopCategory",
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
  medicineShopCoverImg: {
    type: String,  // Cloudinary URL of the main image
    required: false,
    default: "",
  },
  medicineShopImg: [
    {
      type: String, // Cloudinary URL of the sub image
    },
  ],
});



const MedicineShop = mongoose.model("MedicineShop", medicineShopSchema);

export default MedicineShop;
