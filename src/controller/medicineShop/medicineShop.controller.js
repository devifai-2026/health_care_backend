import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import handleMongoErrors from "../../utils/mongooseError.js";
import MedicineShopCategory from "../../models/medicineShop/medicineShopCategort.model.js"
import MedicineShop from "../../models/medicineShop/medicineShop.model.js"

// Create Medicine Shop
export const createMedineShop = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      category,
      address,
      pincode,
      contactNumber,
      email,
      specialties,
      about,
      amenities,
      isActive,
      medicineShopCoverImg,
      medicineShopImg
    } = req.body;

    // Validation
    if (
      !name ||
      !category ||
      !address ||
      !contactNumber ||
      !email ||
      !specialties ||
      !about ||
      !medicineShopCoverImg,
      !medicineShopImg
    ) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "All required fields must be filled"));
    }

    // Check if category exists
    const categoryExists = await MedicineShopCategory.findById(category);
    if (!categoryExists) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Medicine Shop category not found"));
    }

    // Check if Medicine Shop with email already exists
    const existingMedicineShop = await MedicineShop.findOne({ email });
    if (existingMedicineShop) {
      return res
        .status(409)
        .json(
          new ApiResponse(
            409,
            null,
            "Medicine Shop with this email already exists"
          )
        );
    }

    // Create new Medicine Shop
    const medicineShop = new MedicineShop({
      name,
      category,
      address,
      pincode,
      contactNumber,
      email,
      specialties: Array.isArray(specialties) ? specialties : [specialties],
      about,
      amenities: Array.isArray(amenities) ? amenities : [amenities],
      isActive: isActive || false,
      medicineShopCoverImg,
      medicineShopImg : Array.isArray(medicineShopImg) ? medicineShopImg : [medicineShopImg],
    });

    await medicineShop.save();
    await medicineShop.populate("category", "name description");

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          medicineShop,
          "Medicine Shop created successfully"
        )
      );
  } catch (error) {
    console.log(error.message);
    return handleMongoErrors(error, res);
  }
});

// Get All Medicine Shop
export const getAllMedicineShop = asyncHandler(async (req, res) => {
  try {
    // Then try with population
    const medicineShop = await MedicineShop.find()
      .populate("category", "name description")
      .sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          medicineShop,
          "Medicine Shop retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Active Medicine Shop
export const getActiveMedicineShop = asyncHandler(async (req, res) => {
  try {
    const medicineShops = await MedicineShop.find({ isActive: true })
      .populate("category", "name description")
      .sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          medicineShops,
          "Active Medicine Shop retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Medicine Shop by ID
export const getMedicineShopById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const medicineShop = await MedicineShop.findById(id).populate(
      "category",
      "name description"
    );

    if (!medicineShop) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Medicine Shop not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          medicineShop,
          "Medicine Shop retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Medicine Shop by Category
export const getMedicineShopsByCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;

    const medicineShops = await MedicineShop.find({
      category: categoryId,
      isActive: true,
    })
      .populate("category", "name description")
      .sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          medicineShops,
          "Medicine Shop by category retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Update Medicine Shop
export const updateMedicineShop = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;


    const medicineShop = await MedicineShop.findById(id);
    if (!medicineShop) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Medicine Shop center not found"));
    }

    // Check if category exists (if being updated)
    if (updateData.category) {
      const categoryExists = await MedicineShopCategory.findById(updateData.category);
      if (!categoryExists) {
        return res
          .status(404)
          .json(new ApiResponse(404, null, "Medicine Shop category not found"));
      }
    }

    // Check if email already exists (excluding current medicine shop)
    if (updateData.email && updateData.email !== medicineShop.email) {
      const existingMedicineShop = await MedicineShop.findOne({
        email: updateData.email,
      });
      if (existingMedicineShop) {
        return res
          .status(409)
          .json(
            new ApiResponse(
              409,
              null,
              "Medicine Shop with this email already exists"
            )
          );
      }
    }

    // Update Medicine Shop
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        if (key === "specialties" && typeof updateData[key] === "string") {
          medicineShop[key] = [updateData[key]];
        } else {
          medicineShop[key] = updateData[key];
        }
      }
    });

    await medicineShop.save();
    await medicineShop.populate("category", "name description");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          medicineShop,
          "Medicine Shop center updated successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Delete Medicine Shop
export const deleteMedicineShopCenter = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const medicineShop = await MedicineShop.findByIdAndDelete(id);
    if (!medicineShop) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Medicine Shop not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "Medicine Shop deleted successfully")
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Search Medicine Shop
export const searchMedicineShop = asyncHandler(async (req, res) => {
  try {
    const { query, category, pincode } = req.query;

    let searchCriteria = { isActive: true };

    if (query) {
      searchCriteria.$or = [
        { name: { $regex: query, $options: "i" } },
        { specialties: { $in: [new RegExp(query, "i")] } },
        { address: { $regex: query, $options: "i" } },
      ];
    }

    if (category) {
      searchCriteria.category = category;
    }

    if (pincode) {
      searchCriteria.pincode = parseInt(pincode);
    }

    const medicineShops = await MedicineShop.find(searchCriteria)
      .populate("category", "name description")
      .sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          medicineShops,
          "Medicine Shops search results"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Medicine Shops by Pincode
export const getMedicineShopByPincode = asyncHandler(async (req, res) => {
  try {
    const { pincode } = req.params;

    const medicineShops = await MedicineShop.find({
      pincode: parseInt(pincode),
      isActive: true,
    })
      .populate("category", "name description")
      .sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          medicineShops,
          "Medicine by pincode retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});