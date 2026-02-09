import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import handleMongoErrors from "../../utils/mongooseError.js";
import DietitianCategory from "../../models/dietitian/dietitianCategory.model.js";
import Dietitian from "../../models/dietitian/dietitian.model.js";


export const createDietitianCategory = asyncHandler(async (req, res) => {
    try {
        const { name, description, isActive } = req.body;
        // Validation
    if (!name) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Category name is required"));
    }
    // Check if category already exists
    const existingCategory = await DietitianCategory.findOne({ name });
    if (existingCategory) {
      return res
        .status(409)
        .json(new ApiResponse(409, null, "Dietitian category already exists"));
    }

     // Create new category
    const category = new DietitianCategory({
      name,
      description: description || "",
      isActive: isActive || false,
    });

    await category.save();

    return res
      .status(201)
      .json(
        new ApiResponse(201, category, "Dietitian category created successfully")
      );
    } catch (error) {
        return handleMongoErrors(error, res);
    }
});

export const getAllDietitianCategories  = asyncHandler(async (req, res) => {
  try {
    const categories = await DietitianCategory.find().sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          categories,
          "Dietitian categories retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

export const getActiveDietitianCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await DietitianCategory.find({ isActive: true }).sort({
      name: 1,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          categories,
          "Active Dietitian categories retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

export const getDietitianCategoryById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const category = await DietitianCategory.findById(id);
    if (!category) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Dietitian category not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, category, "Dietitian category retrieved successfully")
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

export const updateDietitianCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const category = await DietitianCategory.findById(id);
    if (!category) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Dietitian category not found"));
    }

    // Check if name already exists (excluding current category)
    if (name && name !== category.name) {
      const existingCategory = await DietitianCategory.findOne({ name });
      if (existingCategory) {
        return res
          .status(409)
          .json(
            new ApiResponse(409, null, "Dietitian category name already exists")
          );
      }
    }

    const DietitianCount = await Dietitian.countDocuments({
      category: id,
    });

    if (isActive === false && DietitianCount > 0) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            `Cannot deactivate category. ${DietitianCount} Dietitian service(s) are using this category.`
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
        new ApiResponse(200, category, "Dietitian category updated successfully")
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

export const deleteDietitianCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

  
    const DietitianCount = await Dietitian.countDocuments({
      category: id,
    });

    if (DietitianCount > 0) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            "Cannot delete category. Dietitian are using this category."
          )
        );
    }

    const category = await DietitianCategory.findByIdAndDelete(id);
    if (!category) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Dietitian category not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Dietitian category deleted successfully"));
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});