import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import handleMongoErrors from "../../utils/mongooseError.js";
import ElderCareOrgCategory from "../../models/elderCareOrg/elderCareOrgCategory.model.js"
import ElderCareOrg from "../../models/elderCareOrg/elderCareOrg.model.js";

// Create Elder Care Org Category
export const createElderCareOrgCategory = asyncHandler(async (req, res) => {
    try {
        const { name, description, isActive } = req.body;
        // Validation
    if (!name) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Category name is required"));
    }
    // Check if category already exists
    const existingCategory = await ElderCareOrgCategory.findOne({ name });
    if (existingCategory) {
      return res
        .status(409)
        .json(new ApiResponse(409, null, "Elder Care Org category already exists"));
    }

     // Create new category
    const category = new ElderCareOrgCategory({
      name,
      description: description || "",
      isActive: isActive || false,
    });

    await category.save();

    return res
      .status(201)
      .json(
        new ApiResponse(201, category, "Elder Care Org category created successfully")
      );
    } catch (error) {
        return handleMongoErrors(error, res);
    }
});

// Get All Elder Care Org Categories
export const getAllElderCareOrgCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await ElderCareOrgCategory.find().sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          categories,
          "Elder Care Org categories retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Active Elder Care Org Categories
export const getActiveElderCareOrgCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await ElderCareOrgCategory.find({ isActive: true }).sort({
      name: 1,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          categories,
          "Active Elder Care Org categories retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Elder Care Org Category by ID
export const getElderCareOrgCategoryById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const category = await ElderCareOrgCategory.findById(id);
    if (!category) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Elder Care Org category not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, category, "Elder Care Org category retrieved successfully")
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Update Elder Care Org Category
export const updateElderCareOrgCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const category = await ElderCareOrgCategory.findById(id);
    if (!category) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Elder Care Org category not found"));
    }

    // Check if name already exists (excluding current category)
    if (name && name !== category.name) {
      const existingCategory = await ElderCareOrgCategory.findOne({ name });
      if (existingCategory) {
        return res
          .status(409)
          .json(
            new ApiResponse(409, null, "Elder Care Org category name already exists")
          );
      }
    }

    const elderCareOrgCount = await ElderCareOrg.countDocuments({
      category: id,
    });

    if (isActive === false && elderCareOrgCount > 0) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            `Cannot deactivate category. ${elderCareOrgCount} Elder Care Org center(s) are using this category.`
          )
        );
    }
    // Update fields
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    return res
      .status(200)
      .json(
        new ApiResponse(200, category, "Elder Care Org category updated successfully")
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Delete Elder Care Org Category
export const deleteElderCareOrgCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const elderCareOrgCount = await ElderCareOrg.countDocuments({
      category: id,
    });

    if (elderCareOrgCount > 0) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            "Cannot delete category. Elder Care Org centers are using this category."
          )
        );
    }

    const category = await ElderCareOrgCategory.findByIdAndDelete(id);
    if (!category) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Elder Care Org category not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Elder Care Org category deleted successfully"));
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});