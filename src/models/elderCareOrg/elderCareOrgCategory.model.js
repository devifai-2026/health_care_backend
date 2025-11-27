import mongoose from "mongoose";

const elderCareOrgCategorySchema = new mongoose.Schema({
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

const ElderCareOrgCategory = mongoose.model("ElderCareOrgCategory", elderCareOrgCategorySchema);

export default ElderCareOrgCategory;