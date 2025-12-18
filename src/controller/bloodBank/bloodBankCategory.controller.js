import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import handleMongoErrors from "../../utils/mongooseError.js";
import BloodBankCategory from "../../models/bloodBank/bloodBankCategory.model.js"
import BloodBank from "../../models/bloodBank/bloodBank.model.js"

// Create Blood Bank Category
export const createBloodBankCategory = asyncHandler(async (req, res) => {
    try {
        const { name, description, isActive } = req.body;
        // Validation
    if (!name) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Blood Bank name is required"));
    }
    // Check if category already exists
    const existingCategory = await BloodBankCategory.findOne({ name });
    if (existingCategory) {
      return res
        .status(409)
        .json(new ApiResponse(409, null, "Blood Bank category already exists"));
    }

     // Create new category
    const category = new BloodBankCategory({
      name,
      description: description || "",
      isActive: isActive || false,
    });

    await category.save();

    return res
      .status(201)
      .json(
        new ApiResponse(201, category, "Blood Bank category created successfully")
      );
    } catch (error) {
        return handleMongoErrors(error, res);
    }
});

// Get All Blood Bank Categories
export const getAllBloodBankCategories  = asyncHandler(async (req, res) => {
  try {
    const categories = await BloodBankCategory.find().sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          categories,
          "Blood Bank categories retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Active Blood Bank Categories
export const getActiveBloodBankCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await BloodBankCategory.find({ isActive: true }).sort({
      name: 1,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          categories,
          "Active Blood Bank categories retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Blood Bank Category by ID
export const getBloodBankCategoryById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const category = await BloodBankCategory.findById(id);
    if (!category) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Blood Bank category not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, category, "Blood Bank category retrieved successfully")
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Update Blood Bank Category
export const updateBloodBankCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const category = await BloodBankCategory.findById(id);
    if (!category) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Blood Bank category not found"));
    }

    // Check if name already exists (excluding current category)
    if (name && name !== category.name) {
      const existingCategory = await BloodBankCategory.findOne({ name });
      if (existingCategory) {
        return res
          .status(409)
          .json(
            new ApiResponse(409, null, "Blood Bank category name already exists")
          );
      }
    }

    const bloodBankCount = await BloodBank.countDocuments({
      category: id,
    });

    if (isActive === false && bloodBankCount > 0) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            `Cannot deactivate category. ${bloodBankCount} Blood Bank center(s) are using this category.`
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
        new ApiResponse(200, category, "Blood Bank category updated successfully")
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Delete Blood Bank Category
export const deleteBloodBankCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const bloodBankCount = await BloodBank.countDocuments({
      category: id,
    });

    if (bloodBankCount > 0) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            "Cannot delete category. Blood Bank centers are using this category."
          )
        );
    }

    const category = await BloodBankCategory.findByIdAndDelete(id);
    if (!category) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Blood Bank category not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Blood Bank category deleted successfully"));
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});