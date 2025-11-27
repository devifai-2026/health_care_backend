import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import handleMongoErrors from "../../utils/mongooseError.js";
import BloodBankCategory from "../../models/bloodBank/bloodBankCategory.model.js"
import BloodBank from "../../models/bloodBank/bloodBank.model.js"

// Create Blood Bank
export const createBloodBank = asyncHandler(async (req, res) => {
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
      bloodBankCoverImg,
      bloodBankImg
    } = req.body;

    // Validation
    if (
      !name ||
      !category ||
      !address ||
      !contactNumber ||
      !email ||
      !specialties ||
      !bloodBankCoverImg,
      !bloodBankImg
    ) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "All required fields must be filled"));
    }

    // Check if category exists
    const categoryExists = await BloodBankCategory.findById(category);
    if (!categoryExists) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Blood Bank category not found"));
    }

    // Check if Blood Bank with email already exists
    const existingBloodBank = await BloodBank.findOne({ email });
    if (existingBloodBank) {
      return res
        .status(409)
        .json(
          new ApiResponse(
            409,
            null,
            "Blood Bank with this email already exists"
          )
        );
    }

    // Create new blood bank
    const bloodBank = new BloodBank({
      name,
      category,
      address,
      pincode,
      contactNumber,
      email,
      specialties: Array.isArray(specialties) ? specialties : [specialties],
      isActive: isActive || false,
      bloodBankCoverImg,
      bloodBankImg : Array.isArray(bloodBankImg) ? bloodBankImg : [bloodBankImg],
    });

    await bloodBank.save();
    await bloodBank.populate("category", "name description");

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          bloodBank,
          "Medicine Shop created successfully"
        )
      );
  } catch (error) {
    console.log(error.message);
    return handleMongoErrors(error, res);
  }
});

// Get All Blood Bank
export const getAllBloodBank = asyncHandler(async (req, res) => {
  try {
    // Then try with population
    const bloodBank = await BloodBank.find()
      .populate("category", "name description")
      .sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          bloodBank,
          "Blood Bank retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Active Blood Bank
export const getActiveBloodBank = asyncHandler(async (req, res) => {
  try {
    const bloodBanks = await BloodBank.find({ isActive: true })
      .populate("category", "name description")
      .sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          bloodBanks,
          "Active Blood Bank retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Blood Bank by ID
export const getBloodBankById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const bloodBank = await BloodBank.findById(id).populate(
      "category",
      "name description"
    );

    if (!bloodBank) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Blood Bank not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          bloodBank,
          "Blood Bank retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Blood Bank by Category
export const getBloodBanksByCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;

    const bloodBanks = await BloodBank.find({
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
          bloodBanks,
          "Blood banks by category retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Update Blood Bank
export const updateBloodBank = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const bloodBank = await BloodBank.findById(id);
    if (!bloodBank) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Blood Bank center not found"));
    }
    // Check if category exists (if being updated)
    if (updateData.category) {
      const categoryExists = await BloodBankCategory.findById(updateData.category);
      if (!categoryExists) {
        return res
          .status(404)
          .json(new ApiResponse(404, null, "Blood Bank category not found"));
      }
    }
    // Check if email already exists (excluding current Blood Bank)
    if (updateData.email && updateData.email !== bloodBank.email) {
      const existingBloodBank = await BloodBank.findOne({
        email: updateData.email,
      });
      if (existingBloodBank) {
        return res
          .status(409)
          .json(
            new ApiResponse(
              409,
              null,
              "Blood Bank with this email already exists"
            )
          );
      }
    }
    // Update Blood Bank
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        if (key === "specialties" && typeof updateData[key] === "string") {
          bloodBank[key] = [updateData[key]];
        } else {
          bloodBank[key] = updateData[key];
        }
      }
    });
    await bloodBank.save();
    await bloodBank.populate("category", "name description");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          bloodBank,
          "Blood Bank center updated successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Delete Blood Bank
export const deleteBloodBankCenter = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const bloodBank = await BloodBank.findByIdAndDelete(id);
    if (!bloodBank) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Blood Bank not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "Blood Bank deleted successfully")
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Search Blood Bank
export const searchBloodBank = asyncHandler(async (req, res) => {
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

    const bloodBanks = await BloodBank.find(searchCriteria)
      .populate("category", "name description")
      .sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          bloodBanks,
          "Blood Bank search results"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Blood Bank by Pincode
export const getBloodBankByPincode = asyncHandler(async (req, res) => {
  try {
    const { pincode } = req.params;

    const bloodBanks = await BloodBank.find({
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
          bloodBanks,
          "Blood Bank by pincode retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});