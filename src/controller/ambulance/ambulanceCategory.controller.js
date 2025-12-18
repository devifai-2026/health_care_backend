import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import handleMongoErrors from "../../utils/mongooseError.js";
import AmbulanceCategory from "../../models/ambulance/ambulanceCategory.model.js";
import Ambulance from "../../models/ambulance/ambulance.model.js";

// Create Ambulance Category
export const createAmbulanceCategory = asyncHandler(async (req, res) => {
    try {
        const { name, description, isActive } = req.body;
        // Validation
    if (!name) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Category name is required"));
    }
    // Check if category already exists
    const existingCategory = await AmbulanceCategory.findOne({ name });
    if (existingCategory) {
      return res
        .status(409)
        .json(new ApiResponse(409, null, "Ambulance category already exists"));
    }

     // Create new category
    const category = new AmbulanceCategory({
      name,
      description: description || "",
      isActive: isActive || false,
    });

    await category.save();

    return res
      .status(201)
      .json(
        new ApiResponse(201, category, "Ambulance category created successfully")
      );
    } catch (error) {
        return handleMongoErrors(error, res);
    }
});

// Get All Ambulance Categories
export const getAllAmbulanceCategories  = asyncHandler(async (req, res) => {
  try {
    const categories = await AmbulanceCategory.find().sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          categories,
          "Ambulance categories retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Active Ambulance Categories
export const getActiveAmbulanceCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await AmbulanceCategory.find({ isActive: true }).sort({
      name: 1,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          categories,
          "Active Ambulance categories retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Ambulance Category by ID
export const getAmbulanceCategoryById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const category = await AmbulanceCategory.findById(id);
    if (!category) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Ambulance category not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, category, "Ambulance category retrieved successfully")
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Update Ambulance Category
export const updateAmbulanceCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const category = await AmbulanceCategory.findById(id);
    if (!category) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Ambulance category not found"));
    }

    // Check if name already exists (excluding current category)
    if (name && name !== category.name) {
      const existingCategory = await AmbulanceCategory.findOne({ name });
      if (existingCategory) {
        return res
          .status(409)
          .json(
            new ApiResponse(409, null, "Ambulance category name already exists")
          );
      }
    }

    const ambulanceCount = await Ambulance.countDocuments({
      category: id,
    });

    if (isActive === false && ambulanceCount > 0) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            `Cannot deactivate category. ${ambulanceCount} ambulance(s) are using this category.`
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
        new ApiResponse(200, category, "Ambulance category updated successfully")
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Delete Ambulance Category
export const deleteAmbulanceCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

  
    const ambulanceCount = await Ambulance.countDocuments({
      category: id,
    });

    if (ambulanceCount > 0) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            "Cannot delete category. Ambulance centers are using this category."
          )
        );
    }

    const category = await AmbulanceCategory.findByIdAndDelete(id);
    if (!category) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Ambulance category not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Ambulance category deleted successfully"));
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});