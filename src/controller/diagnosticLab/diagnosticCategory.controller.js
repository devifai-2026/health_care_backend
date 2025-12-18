import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import handleMongoErrors from "../../utils/mongooseError.js";
import DiagnosticLabCategory from "../../models/diagnosticLab/diagnosticLabCategory.model.js";
import DiagnosticLab from "../../models/diagnosticLab/diagnosticLab.model.js";

// Create Diagnostic Lab Category
export const createDiagnosticLabCategory = asyncHandler(async (req, res) => {
    try {
        const { name, description, isActive } = req.body;
        // Validation
    if (!name) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Category name is required"));
    }
    // Check if category already exists
    const existingCategory = await DiagnosticLabCategory.findOne({ name });
    if (existingCategory) {
      return res
        .status(409)
        .json(new ApiResponse(409, null, "Diagnostic Lab category already exists"));
    }

     // Create new category
    const category = new DiagnosticLabCategory({
      name,
      description: description || "",
      isActive: isActive || false,
    });

    await category.save();

    return res
      .status(201)
      .json(
        new ApiResponse(201, category, "Diagnostic Lab category created successfully")
      );
    } catch (error) {
        return handleMongoErrors(error, res);
    }
});

// Get All Diagnostic Lab Categories
export const getAllDiagnosticLabCategories  = asyncHandler(async (req, res) => {
  try {
    const categories = await DiagnosticLabCategory.find().sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          categories,
          "Diagnostic Lab categories retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Active Diagnostic Lab Categories
export const getActiveDiagnosticLabCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await DiagnosticLabCategory.find({ isActive: true }).sort({
      name: 1,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          categories,
          "Active Diagnostic Lab categories retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Diagnostic Lab Category by ID
export const getDiagnosticLabCategoryById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const category = await DiagnosticLabCategory.findById(id);
    if (!category) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Diagnostic Lab category not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, category, "Diagnostic Lab category retrieved successfully")
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Update Diagnostic Lab Category
export const updateDiagnosticLabCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const category = await DiagnosticLabCategory.findById(id);
    if (!category) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Diagnostic Lab category not found"));
    }

    // Check if name already exists (excluding current category)
    if (name && name !== category.name) {
      const existingCategory = await DiagnosticLabCategory.findOne({ name });
      if (existingCategory) {
        return res
          .status(409)
          .json(
            new ApiResponse(409, null, "Diagnostic Lab category name already exists")
          );
      }
    }

    const diagnosticLabCount = await DiagnosticLab.countDocuments({
      category: id,
    });

    if (isActive === false && diagnosticLabCount > 0) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            `Cannot deactivate category. ${diagnosticLabCount} Diagnostic Lab center(s) are using this category.`
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
        new ApiResponse(200, category, "Diagnostic Lab category updated successfully")
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Delete Diagnostic Lab Category
export const deleteDiagnosticLabCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

  
    const diagnosticLabCount = await DiagnosticLab.countDocuments({
      category: id,
    });

    if (diagnosticLabCount > 0) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            "Cannot delete category. Diagnostic Lab centers are using this category."
          )
        );
    }

    const category = await DiagnosticLabCategory.findByIdAndDelete(id);
    if (!category) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Diagnostic Lab category not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Diagnostic Lab category deleted successfully"));
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});