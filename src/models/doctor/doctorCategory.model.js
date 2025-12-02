import mongoose from "mongoose";

const doctorCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: false,
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


const DoctorCategory = mongoose.model("DoctorCategory", doctorCategorySchema);

export default DoctorCategory;
