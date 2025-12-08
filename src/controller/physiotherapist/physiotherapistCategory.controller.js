import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import handleMongoErrors from "../../utils/mongooseError.js";
import PhysiotherapistCategory from "../../models/physiotherapist/physiotherapistCategory.model.js";
import Physiotherapist from "../../models/physiotherapist/physiotherapist.model.js";

// Create Physiotherapist Category
export const createPhysiotherapistCategory = asyncHandler(async (req, res) => {
    try {
        const { name, description, isActive } = req.body;
        // Validation
    if (!name) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Category name is required"));
    }
    // Check if category already exists
    const existingCategory = await PhysiotherapistCategory.findOne({ name });
    if (existingCategory) {
      return res
        .status(409)
        .json(new ApiResponse(409, null, "Physiotherapist category already exists"));
    }

     // Create new category
    const category = new PhysiotherapistCategory({
      name,
      description: description || "",
      isActive: isActive || false,
    });

    await category.save();

    return res
      .status(201)
      .json(
        new ApiResponse(201, category, "Physiotherapist category created successfully")
      );
    } catch (error) {
        return handleMongoErrors(error, res);
    }
});

// Get All Physiotherapist Categories
export const getAllPhysiotherapistCategories  = asyncHandler(async (req, res) => {
  try {
    const categories = await PhysiotherapistCategory.find().sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          categories,
          "Physiotherapist categories retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Active Physiotherapist Categories
export const getActivePhysiotherapistCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await PhysiotherapistCategory.find({ isActive: true }).sort({
      name: 1,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          categories,
          "Active Physiotherapist categories retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Physiotherapist Category by ID
export const getPhysiotherapistCategoryById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const category = await PhysiotherapistCategory.findById(id);
    if (!category) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Physiotherapist category not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, category, "Physiotherapist category retrieved successfully")
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Update Physiotherapist Category
export const updatePhysiotherapistCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const category = await PhysiotherapistCategory.findById(id);
    if (!category) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Physiotherapist category not found"));
    }

    // Check if name already exists (excluding current category)
    if (name && name !== category.name) {
      const existingCategory = await PhysiotherapistCategory.findOne({ name });
      if (existingCategory) {
        return res
          .status(409)
          .json(
            new ApiResponse(409, null, "Physiotherapist category name already exists")
          );
      }
    }

    // Update fields
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    return res
      .status(200)
      .json(
        new ApiResponse(200, category, "Physiotherapist category updated successfully")
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Delete Physiotherapist Category
export const deletePhysiotherapistCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

  
    const PhysiotherapistCount = await Physiotherapist.countDocuments({
      category: id,
    });

    if (PhysiotherapistCount > 0) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            "Cannot delete category. Physiotherapist centers are using this category."
          )
        );
    }

    const category = await PhysiotherapistCategory.findByIdAndDelete(id);
    if (!category) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Physiotherapist category not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Physiotherapist category deleted successfully"));
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});