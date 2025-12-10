import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import handleMongoErrors from "../../utils/mongooseError.js";
import AmbulanceCategory from "../../models/ambulance/ambulanceCategory.model.js";
import Ambulance from "../../models/ambulance/ambulance.model.js";

// Create Ambulance
export const createAmbulance = asyncHandler(async (req, res) => {
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
      ambulanceCoverImg,
      ambulanceImg
    } = req.body;

    console.log(req.body);

    // Validation
    if (
      !name ||
      !category ||
      !address ||
      !contactNumber ||
      !email ||
      !specialties ||
      !about ||
      !ambulanceCoverImg,
      !ambulanceImg
    ) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "All required fields must be filled"));
    }

    // Check if category exists
    const categoryExists = await AmbulanceCategory.findById(category);
    if (!categoryExists) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Ambulance category not found"));
    }

    // Check if healthcare center with email already exists
    const existingAmbulance = await Ambulance.findOne({ email });
    if (existingAmbulance) {
      return res
        .status(409)
        .json(
          new ApiResponse(
            409,
            null,
            "Ambulance with this email already exists"
          )
        );
    }

    // Create new healthcare center
    const ambulance = new Ambulance({
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
      ambulanceCoverImg,
      ambulanceImg : Array.isArray(ambulanceImg) ? ambulanceImg : [ambulanceImg],
    });

    await ambulance.save();
    await ambulance.populate("category", "name description");

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          ambulance,
          "Diagnostic Lab created successfully"
        )
      );
  } catch (error) {
    console.log(error.message);
    return handleMongoErrors(error, res);
  }
});

// Get All Ambulance
export const getAllAmbulance = asyncHandler(async (req, res) => {
  try {
    // Then try with population
    const ambulance = await Ambulance.find()
      .populate("category", "name description")
      .sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          ambulance,
          "Ambulance retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Active  Ambulance
export const getActiveAmbulance = asyncHandler(async (req, res) => {
  try {
    const ambulance = await Ambulance.find({ isActive: true })
      .populate("category", "name description")
      .sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          ambulance,
          "Active  Ambulance retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Ambulance by ID
export const getAmbulanceById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const ambulance = await Ambulance.findById(id).populate(
      "category",
      "name description"
    );

    if (!ambulance) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Ambulance not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          ambulance,
          "Ambulance retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Ambulance by Category
export const getAmbulancebByCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;

    const ambulances = await Ambulance.find({
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
          ambulances,
          "Ambulance by category retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Update  Ambulance
export const updateAmbulance = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const  ambulance = await Ambulance.findById(id);
    if (!ambulance) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, " Ambulance center not found"));
    }

    // Check if category exists (if being updated)
    if (updateData.category) {
      const categoryExists = await AmbulanceCategory.findById(updateData.category);
      if (!categoryExists) {
        return res
          .status(404)
          .json(new ApiResponse(404, null, " Ambulance category not found"));
      }
    }

    // Check if email already exists (excluding current  Ambulance)
    if (updateData.email && updateData.email !== ambulance.email) {
      const existingAmbulance = await Ambulance.findOne({
        email: updateData.email,
      });
      if (existingAmbulance) {
        return res
          .status(409)
          .json(
            new ApiResponse(
              409,
              null,
              " Ambulance with this email already exists"
            )
          );
      }
    }

    // Update  Ambulance
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        if (key === "specialties" && typeof updateData[key] === "string") {
          ambulance[key] = [updateData[key]];
        } else {
          ambulance[key] = updateData[key];
        }
      }
    });

    await ambulance.save();
    await ambulance.populate("category", "name description");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          ambulance,
          " Ambulance center updated successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Delete Ambulance
export const deleteAmbulance = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const ambulance = await Ambulance.findByIdAndDelete(id);
    if (!ambulance) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Ambulance not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "Ambulance deleted successfully")
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Search Ambulance
export const searchAmbulance = asyncHandler(async (req, res) => {
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

    const ambulances = await Ambulance.find(searchCriteria)
      .populate("category", "name description")
      .sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          ambulances,
          "Ambulance search results"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Ambulance by Pincode
export const getAmbulanceByPincode = asyncHandler(async (req, res) => {
  try {
    const { pincode } = req.params;

    const ambulances = await Ambulance.find({
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
          ambulances,
          "Ambulance by pincode retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});