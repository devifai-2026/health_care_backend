import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import handleMongoErrors from "../../utils/mongooseError.js";
import PhysiotherapistCategory from "../../models/physiotherapist/physiotherapistCategory.model.js";
import Physiotherapist from "../../models/physiotherapist/physiotherapist.model.js";

// Create Physiotheristapist
export const createPhysiotheripst = asyncHandler(async (req, res) => {
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
      physiotherapistCoverImg,
      physiotherapistImg
    } = req.body;

    // Validation
    if (
      !name ||
      !category ||
      !address ||
      !contactNumber ||
      !email ||
      !specialties ||
      !physiotherapistCoverImg,
      !physiotherapistImg
    ) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "All required fields must be filled"));
    }

    // Check if category exists
    const categoryExists = await PhysiotherapistCategory.findById(category);
    if (!categoryExists) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Physiotheristapist category not found"));
    }

    // Check if physiotheripst with email already exists
    const existingPhysiotheripst = await Physiotherapist.findOne({ email });
    if (existingPhysiotheripst) {
      return res
        .status(409)
        .json(
          new ApiResponse(
            409,
            null,
            "Physiotheristapist with this email already exists"
          )
        );
    }

    // Create new healthcare center
    const physiotherapist = new Physiotherapist({
      name,
      category,
      address,
      pincode,
      contactNumber,
      email,
      specialties: Array.isArray(specialties) ? specialties : [specialties],
      isActive: isActive || false,
      physiotherapistCoverImg,
      physiotherapistImg : Array.isArray(physiotherapistImg) ? physiotherapistImg : [physiotherapistImg],
    });

    await physiotherapist.save();
    await physiotherapist.populate("category", "name description");

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          physiotherapist,
          "Physiotheristapist created successfully"
        )
      );
  } catch (error) {
    console.log(error.message);
    return handleMongoErrors(error, res);
  }
});

// Get All Physiotheristapist
export const getAllPhysiotheristapist = asyncHandler(async (req, res) => {
  try {
    // Then try with population
    const physiotheristapist = await Physiotherapist.find()
      .populate("category", "name description")
      .sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          physiotheristapist,
          "Physiotheristapist retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Active  Physiotheristapist
export const getActivePhysiotheristapist = asyncHandler(async (req, res) => {
  try {
    const physiotherapist = await Physiotherapist.find({ isActive: true })
      .populate("category", "name description")
      .sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          physiotherapist,
          "Active  Physiotheristapist retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Physiotheristapist by ID
export const getPhysiotherapistById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const physiotherapist = await Physiotherapist.findById(id).populate(
      "category",
      "name description"
    );

    if (!physiotherapist) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Physiotheristapist not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          physiotherapist,
          "Physiotheristapist retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Physiotheristapist by Category
export const getPhysiotheristapistByCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;

    const physiotherapist = await Physiotherapist.find({
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
          physiotherapist,
          "Physiotheristapist by category retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Update  Physiotheristapist
export const updatePhysiotherapist = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const physiotheristapist = await Physiotherapist.findById(id);
    if (!physiotheristapist) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, " Physiotheristapist center not found"));
    }

    // Check if category exists (if being updated)
    if (updateData.category) {
      const categoryExists = await PhysiotherapistCategory.findById(updateData.category);
      if (!categoryExists) {
        return res
          .status(404)
          .json(new ApiResponse(404, null, " Physiotheristapist category not found"));
      }
    }

    // Check if email already exists (excluding current  Physiotheristapist)
    if (updateData.email && updateData.email !== physiotheristapist.email) {
      const existingPhysiotheripst = await Physiotherapist.findOne({
        email: updateData.email,
      });
      if (existingPhysiotheripst) {
        return res
          .status(409)
          .json(
            new ApiResponse(
              409,
              null,
              " Physiotheristapist with this email already exists"
            )
          );
      }
    }

    // Update  Physiotheristapist
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        if (key === "specialties" && typeof updateData[key] === "string") {
          physiotheristapist[key] = [updateData[key]];
        } else {
          physiotheristapist[key] = updateData[key];
        }
      }
    });

    await physiotheristapist.save();
    await physiotheristapist.populate("category", "name description");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          physiotheristapist,
          " Physiotheristapist center updated successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Delete Physiotheristapist
export const deletePhysiotheristapist = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const physiotherapist = await Physiotherapist.findByIdAndDelete(id);
    if (!physiotherapist) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Physiotheristapist not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "Physiotheristapist deleted successfully")
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Search Physiotheristapist
export const searchPhysiotheristapist = asyncHandler(async (req, res) => {
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

    const physiotherapist = await Physiotherapist.find(searchCriteria)
      .populate("category", "name description")
      .sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          physiotherapist,
          "Physiotheristapist search results"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Physiotheristapist by Pincode
export const getPhysiotheristapistByPincode = asyncHandler(async (req, res) => {
  try {
    const { pincode } = req.params;

    const physiotherapist = await Physiotherapist.find({
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
          physiotherapist,
          "Physiotheristapist by pincode retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});