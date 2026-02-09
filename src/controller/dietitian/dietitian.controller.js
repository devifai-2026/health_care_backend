import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import handleMongoErrors from "../../utils/mongooseError.js";
import DietitianCategory from "../../models/dietitian/dietitianCategory.model.js";
import Dietitian from "../../models/dietitian/dietitian.model.js";

export const createDietitian = asyncHandler(async (req, res) => {
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
      dietitianCoverImg,
      dietitianImg
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
      !dietitianCoverImg,
      !dietitianImg
    ) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "All required fields must be filled"));
    }

    // Check if category exists
    const categoryExists = await DietitianCategory.findById(category);
    if (!categoryExists) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Dietitian category not found"));
    }

    // Check if dietitian with email already exists
    const existingDietitian = await Dietitian.findOne({ email });
    if (existingDietitian) {
      return res
        .status(409)
        .json(
          new ApiResponse(
            409,
            null,
            "Dietitian with this email already exists"
          )
        );
    }

    // Create new healthcare center
    const dietitian = new Dietitian({
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
      dietitianCoverImg,
      dietitianImg : Array.isArray(dietitianImg) ? dietitianImg : [dietitianImg],
    });

    await dietitian.save();
    await dietitian.populate("category", "name description");

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          dietitian,
          "Dietitian created successfully"
        )
      );
  } catch (error) {
    console.log(error.message);
    return handleMongoErrors(error, res);
  }
});

export const getAllDietitian = asyncHandler(async (req, res) => {
  try {
    // Then try with population
    const dietitian = await Dietitian.find()
      .populate("category", "name description")
      .sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          dietitian,
          "Dietitian retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

export const getActiveDietitian = asyncHandler(async (req, res) => {
  try {
    const dietitian = await Dietitian.find({ isActive: true })
      .populate("category", "name description")
      .sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          dietitian,
          "Active  Dietitian retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

export const getDietitianById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const dietitian = await Dietitian.findById(id).populate(
      "category",
      "name description"
    );

    if (!dietitian) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Dietitian not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          dietitian,
          "Dietitian retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

export const getDietitianByCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;

    const dietitians = await Dietitian.find({
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
          dietitians,
          "Dietitian by category retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

export const updateDietitian = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const dietitian = await Dietitian.findById(id);
    if (!dietitian) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, " Dietitian not found"));
    }

    // Check if category exists (if being updated)
    if (updateData.category) {
      const categoryExists = await DietitianCategory.findById(updateData.category);
      if (!categoryExists) {
        return res
          .status(404)
          .json(new ApiResponse(404, null, " Dietitian category not found"));
      }
    }

    // Check if email already exists (excluding current  Dietitian)
    if (updateData.email && updateData.email !== dietitian.email) {
      const existingDietitian = await Dietitian.findOne({
        email: updateData.email,
      });
      if (existingDietitian) {
        return res
          .status(409)
          .json(
            new ApiResponse(
              409,
              null,
              " Dietitian with this email already exists"
            )
          );
      }
    }

    // Update  Dietitian
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        if (key === "specialties" && typeof updateData[key] === "string") {
          dietitian[key] = [updateData[key]];
        } else {
          dietitian[key] = updateData[key];
        }
      }
    });

    await dietitian.save();
    await dietitian.populate("category", "name description");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          dietitian,
          " Dietitian updated successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

export const deleteDietitian = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const dietitian = await Dietitian.findByIdAndDelete(id);
    if (!dietitian) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Dietitian not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "Dietitian deleted successfully")
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

export const searchDietitian = asyncHandler(async (req, res) => {
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

    const dietitians = await Dietitian.find(searchCriteria)
      .populate("category", "name description")
      .sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          dietitians,
          "Dietitian search results"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

export const getDietitianByPincode = asyncHandler(async (req, res) => {
  try {
    const { pincode } = req.params;

    const dietitians = await Dietitian.find({
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
          dietitians,
          "Dietitian by pincode retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});