import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import handleMongoErrors from "../../utils/mongooseError.js";
import AyaCategory from "../../models/aya/ayaCategory.model.js";
import AyaService from "../../models/aya/ayaService.model.js";

// Create Aya Category
export const createAyaCategory = asyncHandler(async (req, res) => {
    try {
        const { name, description, isActive } = req.body;
        // Validation
    if (!name) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Category name is required"));
    }
    // Check if category already exists
    const existingCategory = await AyaCategory.findOne({ name });
    if (existingCategory) {
      return res
        .status(409)
        .json(new ApiResponse(409, null, "Aya category already exists"));
    }

     // Create new category
    const category = new AyaCategory({
      name,
      description: description || "",
      isActive: isActive || false,
    });

    await category.save();

    return res
      .status(201)
      .json(
        new ApiResponse(201, category, "Aya category created successfully")
      );
    } catch (error) {
        return handleMongoErrors(error, res);
    }
});

// Get All Aya Categories
export const getAllAyaCategories  = asyncHandler(async (req, res) => {
  try {
    const categories = await AyaCategory.find().sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          categories,
          "Aya categories retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Active Aya Categories
export const getActiveAyaCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await AyaCategory.find({ isActive: true }).sort({
      name: 1,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          categories,
          "Active Aya categories retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Aya Category by ID
export const getAyaCategoryById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const category = await AyaCategory.findById(id);
    if (!category) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Aya category not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, category, "Aya category retrieved successfully")
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Update Aya Category
export const updateAyaCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const category = await AyaCategory.findById(id);
    if (!category) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Aya category not found"));
    }

    // Check if name already exists (excluding current category)
    if (name && name !== category.name) {
      const existingCategory = await AyaCategory.findOne({ name });
      if (existingCategory) {
        return res
          .status(409)
          .json(
            new ApiResponse(409, null, "Aya category name already exists")
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
        new ApiResponse(200, category, "Aya category updated successfully")
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Delete Aya Category
export const deleteAyaCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

  
    const AyaCount = await AyaService.countDocuments({
      category: id,
    });

    if (AyaCount > 0) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            "Cannot delete category. Aya centers are using this category."
          )
        );
    }

    const category = await AyaCategory.findByIdAndDelete(id);
    if (!category) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Aya category not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Aya category deleted successfully"));
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});