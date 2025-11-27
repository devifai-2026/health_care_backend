import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import handleMongoErrors from "../../utils/mongooseError.js";
import MedicineShopCategory from "../../models/medicineShop/medicineShopCategort.model.js"
import MedicineShop from "../../models/medicineShop/medicineShop.model.js"

// Create Medicine Shop Category
export const createMedicineShopCategory = asyncHandler(async (req, res) => {
    try {
        const { name, description, isActive } = req.body;
        // Validation
    if (!name) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Category name is required"));
    }
    // Check if category already exists
    const existingCategory = await MedicineShopCategory.findOne({ name });
    if (existingCategory) {
      return res
        .status(409)
        .json(new ApiResponse(409, null, "Medicine Shop category already exists"));
    }

     // Create new category
    const category = new MedicineShopCategory({
      name,
      description: description || "",
      isActive: isActive || false,
    });

    await category.save();

    return res
      .status(201)
      .json(
        new ApiResponse(201, category, "Medicine Shop category created successfully")
      );
    } catch (error) {
        return handleMongoErrors(error, res);
    }
});

// Get All Medicine Shop Categories
export const getAllMedicineShopCategories  = asyncHandler(async (req, res) => {
  try {
    const categories = await MedicineShopCategory.find().sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          categories,
          "Medicine Shop categories retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Active Medicine Shop Categories
export const getActiveMedicineShopCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await MedicineShopCategory.find({ isActive: true }).sort({
      name: 1,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          categories,
          "Active Medicine Shop categories retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Medicine Shop Category by ID
export const getMedicineShopCategoryById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const category = await MedicineShopCategory.findById(id);
    if (!category) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Medicine Shop category not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, category, "Medicine Shop category retrieved successfully")
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Update Medicine Shop Category
export const updateMedicineShopCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const category = await MedicineShopCategory.findById(id);
    if (!category) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Medicine Shop category not found"));
    }

    // Check if name already exists (excluding current category)
    if (name && name !== category.name) {
      const existingCategory = await MedicineShopCategory.findOne({ name });
      if (existingCategory) {
        return res
          .status(409)
          .json(
            new ApiResponse(409, null, "Medicine Shop category name already exists")
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
        new ApiResponse(200, category, "Medicine Shop category updated successfully")
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Delete Medicine Shop Category
export const deleteMedicineShopCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

  
    const medicineShopCount = await MedicineShop.countDocuments({
      category: id,
    });

    if (medicineShopCount > 0) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            "Cannot delete category. Medicine Shop centers are using this category."
          )
        );
    }

    const category = await MedicineShopCategory.findByIdAndDelete(id);
    if (!category) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Medicine Shop category not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Medicine Shop category deleted successfully"));
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});