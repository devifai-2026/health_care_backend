import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import handleMongoErrors from "../../utils/mongooseError.js";
import DiagnosticLab from "../../models/diagnosticLab/diagnosticLab.model.js";
import DiagnosticCategory from "../../models/diagnosticLab/diagnosticLabCategory.model.js";

// Create Diagnostic Lab
export const createDiagnosticLab = asyncHandler(async (req, res) => {
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
      diagnosticLabCoverImg,
      diagnosticLabImg
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
      !diagnosticLabCoverImg,
      !diagnosticLabImg
    ) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "All required fields must be filled"));
    }

    // Check if category exists
    const categoryExists = await DiagnosticCategory.findById(category);
    if (!categoryExists) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Diagnostic Lab category not found"));
    }

    // Check if healthcare center with email already exists
    const existingHealthcare = await DiagnosticLab.findOne({ email });
    if (existingHealthcare) {
      return res
        .status(409)
        .json(
          new ApiResponse(
            409,
            null,
            "Diagnostic Lab with this email already exists"
          )
        );
    }

    // Create new healthcare center
    const diagnosticLab = new DiagnosticLab({
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
      diagnosticLabCoverImg,
      diagnosticLabImg : Array.isArray(diagnosticLabImg) ? diagnosticLabImg : [diagnosticLabImg],
    });

    await diagnosticLab.save();
    await diagnosticLab.populate("category", "name description");

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          diagnosticLab,
          "Diagnostic Lab created successfully"
        )
      );
  } catch (error) {
    console.log(error.message);
    return handleMongoErrors(error, res);
  }
});

// Get All Diagnostic Lab
export const getAllDiagnosticLab = asyncHandler(async (req, res) => {
  try {
    // Then try with population
    const diagnosticLab = await DiagnosticLab.find()
      .populate("category", "name description")
      .sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          diagnosticLab,
          "Diagnostic Lab retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Active  Diagnostic Lab
export const getActiveDiagnosticLab = asyncHandler(async (req, res) => {
  try {
    const diagnosticLab = await DiagnosticLab.find({ isActive: true })
      .populate("category", "name description")
      .sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          diagnosticLab,
          "Active  Diagnostic Lab retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Diagnostic Lab by ID
export const getDiagnosticLabById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const diagnosticLab = await DiagnosticLab.findById(id).populate(
      "category",
      "name description"
    );

    if (!diagnosticLab) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Diagnostic Lab not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          diagnosticLab,
          "Diagnostic Lab retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Diagnostic Lab by Category
export const getDiagnosticLabByCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;

    const diagnosticLabs = await DiagnosticLab.find({
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
          diagnosticLabs,
          "Diagnostic Lab by category retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Update  Diagnostic Lab
export const updateDiagnosticLab = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const diagnosticLab = await DiagnosticLab.findById(id);
    if (!diagnosticLab) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, " Diagnostic Lab center not found"));
    }

    // Check if category exists (if being updated)
    if (updateData.category) {
      const categoryExists = await DiagnosticCategory.findById(updateData.category);
      if (!categoryExists) {
        return res
          .status(404)
          .json(new ApiResponse(404, null, " Diagnostic Lab category not found"));
      }
    }

    // Check if email already exists (excluding current  Diagnostic Lab)
    if (updateData.email && updateData.email !== diagnosticLab.email) {
      const existingDiagnosticLab = await DiagnosticLab.findOne({
        email: updateData.email,
      });
      if (existingDiagnosticLab) {
        return res
          .status(409)
          .json(
            new ApiResponse(
              409,
              null,
              " Diagnostic Lab with this email already exists"
            )
          );
      }
    }

    // Update  Diagnostic Lab
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        if (key === "specialties" && typeof updateData[key] === "string") {
          diagnosticLab[key] = [updateData[key]];
        } else {
          diagnosticLab[key] = updateData[key];
        }
      }
    });

    await diagnosticLab.save();
    await diagnosticLab.populate("category", "name description");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          diagnosticLab,
          " Diagnostic Lab center updated successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Delete Diagnostic Lab
export const deleteDiagnosticLab = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const diagnosticLab = await DiagnosticLab.findByIdAndDelete(id);
    if (!diagnosticLab) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Diagnostic Lab not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "Diagnostic Lab deleted successfully")
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Search Diagnostic Lab
export const searchDiagnosticLab = asyncHandler(async (req, res) => {
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

    const diagnosticLabs = await DiagnosticLab.find(searchCriteria)
      .populate("category", "name description")
      .sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          diagnosticLabs,
          "Diagnostic Lab search results"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Diagnostic Lab by Pincode
export const getDiagnosticLabByPincode = asyncHandler(async (req, res) => {
  try {
    const { pincode } = req.params;

    const diagnosticLabs = await DiagnosticLab.find({
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
          diagnosticLabs,
          "Diagnostic Lab by pincode retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});