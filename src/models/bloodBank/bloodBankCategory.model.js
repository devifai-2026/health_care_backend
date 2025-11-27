import mongoose from "mongoose";

const bloodBankCategorySchema = new mongoose.Schema({
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
});

const BloodBankCategory = mongoose.model("BloodBankCategory", bloodBankCategorySchema);

export default BloodBankCategory;