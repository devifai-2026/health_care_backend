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
   createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const ElderCareOrgCategory = mongoose.model("ElderCareOrgCategory", elderCareOrgCategorySchema);

export default ElderCareOrgCategory;