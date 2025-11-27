import mongoose from "mongoose";

const medicineShopCategorySchema = new mongoose.Schema({
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

const MedicineShopCategory = mongoose.model("MedicineShopCategory", medicineShopCategorySchema);

export default MedicineShopCategory;