import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import handleMongoErrors from "../../utils/mongooseError.js";
import AyaService from "../../models/aya/ayaService.model.js";
import AyaCategory from "../../models/aya/ayaCategory.model.js";

// Create Aya Service
export const createAyaService = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      category,
      address,
      pincode,
      contactNumber,
      email,
      specialties,
      isActive,
      ayaCoverImg,
      ayaImg
    } = req.body;

    // Validation
    if (
      !name ||
      !category ||
      !address ||
      !contactNumber ||
      !email ||
      !specialties ||
      !ayaCoverImg,
      !ayaImg
    ) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "All required fields must be filled"));
    }

    // Check if category exists
    const categoryExists = await AyaCategory.findById(category);
    if (!categoryExists) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Aya Service category not found"));
    }

    // Check if aya service with email already exists
    const existingAyaService = await AyaService.findOne({ email });
    if (existingAyaService) {
      return res
        .status(409)
        .json(
          new ApiResponse(
            409,
            null,
            "Aya Service with this email already exists"
          )
        );
    }

    // Create new healthcare center
    const ayaService = new AyaService({
      name,
      category,
      address,
      pincode,
      contactNumber,
      email,
      specialties: Array.isArray(specialties) ? specialties : [specialties],
      isActive: isActive || false,
      ayaCoverImg,
      ayaImg : Array.isArray(ayaImg) ? ayaImg : [ayaImg],
    });

    await ayaService.save();
    await ayaService.populate("category", "name description");

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          ayaService,
          "Aya Service created successfully"
        )
      );
  } catch (error) {
    console.log(error.message);
    return handleMongoErrors(error, res);
  }
});

// Get All Aya Service
export const getAllAyaService = asyncHandler(async (req, res) => {
  try {
    // Then try with population
    const ayaService = await AyaService.find()
      .populate("category", "name description")
      .sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          ayaService,
          "Aya Service retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Active  Aya Service
export const getActiveAyaService = asyncHandler(async (req, res) => {
  try {
    const ayaService = await AyaService.find({ isActive: true })
      .populate("category", "name description")
      .sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          ayaService,
          "Active  Aya Service retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Aya Service by ID
export const getAyaServiceById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const ayaService = await AyaService.findById(id).populate(
      "category",
      "name description"
    );

    if (!ayaService) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Aya Service not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          ayaService,
          "Aya Service retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Aya Service by Category
export const getAyaServiceByCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;

    const ayaServices = await AyaService.find({
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
          ayaServices,
          "Aya Service by category retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Update  Aya Service
export const updateAyaService = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const ayaService = await AyaService.findById(id);
    if (!ayaService) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, " Aya Service center not found"));
    }

    // Check if category exists (if being updated)
    if (updateData.category) {
      const categoryExists = await AyaCategory.findById(updateData.category);
      if (!categoryExists) {
        return res
          .status(404)
          .json(new ApiResponse(404, null, " Aya Service category not found"));
      }
    }

    // Check if email already exists (excluding current  Aya Service)
    if (updateData.email && updateData.email !== ayaService.email) {
      const existingAyaService = await AyaService.findOne({
        email: updateData.email,
      });
      if (existingAyaService) {
        return res
          .status(409)
          .json(
            new ApiResponse(
              409,
              null,
              " Aya Service with this email already exists"
            )
          );
      }
    }

    // Update  Aya Service
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        if (key === "specialties" && typeof updateData[key] === "string") {
          ayaService[key] = [updateData[key]];
        } else {
          ayaService[key] = updateData[key];
        }
      }
    });

    await ayaService.save();
    await ayaService.populate("category", "name description");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          ayaService,
          " Aya Service center updated successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Delete aya service
export const deleteAyaService = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const ayaService = await AyaService.findByIdAndDelete(id);
    if (!ayaService) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "aya service not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "aya service deleted successfully")
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Search Aya Service
export const searchAyaService = asyncHandler(async (req, res) => {
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

    const ayaServices = await AyaService.find(searchCriteria)
      .populate("category", "name description")
      .sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          ayaServices,
          "Aya Service search results"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Aya Service by Pincode
export const getAyaServiceByPincode = asyncHandler(async (req, res) => {
  try {
    const { pincode } = req.params;

    const ayaServices = await AyaService.find({
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
          ayaServices,
          "Aya Service by pincode retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});
