import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import handleMongoErrors from "../../utils/mongooseError.js";
import ElderCareOrgCategory from "../../models/elderCareOrg/elderCareOrgCategory.model.js"
import ElderCareOrg from "../../models/elderCareOrg/elderCareOrg.model.js";

// Create Elder Care Org
export const createElderCareOrg = asyncHandler(async (req, res) => {
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
      elderCareOrgCoverImg,
      elderCareOrgImg
    } = req.body;
    // Validation
    if (
      !name ||
      !category ||
      !address ||
      !contactNumber ||
      !email ||
      !specialties ||
      !elderCareOrgCoverImg,
      !elderCareOrgImg
    ) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "All required fields must be filled"));
    }

    // Check if category exists
    const categoryExists = await ElderCareOrgCategory.findById(category);
    if (!categoryExists) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Elder Care Org not found"));
    }

    // Check if Elder Care Org with email already exists
    const existingElderCareOrg = await ElderCareOrg.findOne({ email });
    if (existingElderCareOrg) {
      return res
        .status(409)
        .json(
          new ApiResponse(
            409,
            null,
            "Elder Care Org with this email already exists"
          )
        );
    }

    // Create new Elder Care Org
    const elderCareOrg = new ElderCareOrg({
      name,
      category,
      address,
      pincode,
      contactNumber,
      email,
      specialties: Array.isArray(specialties) ? specialties : [specialties],
      isActive: isActive || false,
      elderCareOrgCoverImg,
      elderCareOrgImg : Array.isArray(elderCareOrgImg) ? elderCareOrgImg : [elderCareOrgImg],
    });

    await elderCareOrg.save();
    await elderCareOrg.populate("category", "name description");

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          elderCareOrg,
          "Elder Care Org created successfully"
        )
      );
  } catch (error) {
    console.log(error.message);
    return handleMongoErrors(error, res);
  }
});

// Get All Elder Care Org
export const getAllElderCareOrg = asyncHandler(async (req, res) => {
  try {
    // Then try with population
    const elderCareOrg = await ElderCareOrg.find()
      .populate("category", "name description")
      .sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          elderCareOrg,
          "Elder Care Org retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Active Elder Care Org
export const getActiveElderCareOrg = asyncHandler(async (req, res) => {
  try {
    const elderCareOrgs = await ElderCareOrg.find({ isActive: true })
      .populate("category", "name description")
      .sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          elderCareOrgs,
          "Active Elder Care Org retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Elder Care Org by ID
export const getElderCareOrgById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const elderCareOrg = await ElderCareOrg.findById(id).populate(
      "category",
      "name description"
    );

    if (!elderCareOrg) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Elder Care Org not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          elderCareOrg,
          "Elder Care Org retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Elder Care Org by Category
export const getElderCareOrgByCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;

    const elderCareOrgs = await ElderCareOrg.find({
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
          elderCareOrgs,
          "Elder Care Org by category retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Update  Elder Care Org
export const updateElderCareOrg = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const elderCareOrg = await ElderCareOrg.findById(id);
    if (!elderCareOrg) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, " Elder Care Org center not found"));
    }

    // Check if category exists (if being updated)
    if (updateData.category) {
      const categoryExists = await ElderCareOrgCategory.findById(updateData.category);
      if (!categoryExists) {
        return res
          .status(404)
          .json(new ApiResponse(404, null, " Elder Care Org category not found"));
      }
    }

    // Check if email already exists (excluding current  Elder Care Org)
    if (updateData.email && updateData.email !== elderCareOrg.email) {
      const existingelderCareOrg = await ElderCareOrg.findOne({
        email: updateData.email,
      });
      if (existingelderCareOrg) {
        return res
          .status(409)
          .json(
            new ApiResponse(
              409,
              null,
              " Elder Care Org with this email already exists"
            )
          );
      }
    }

    // Update  Elder Care Org
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        if (key === "specialties" && typeof updateData[key] === "string") {
          elderCareOrg[key] = [updateData[key]];
        } else {
          elderCareOrg[key] = updateData[key];
        }
      }
    });

    await elderCareOrg.save();
    await elderCareOrg.populate("category", "name description");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          elderCareOrg,
          " Elder Care Org center updated successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Delete Elder Care Org
export const deleteElderCareOrg = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const elderCareOrg = await ElderCareOrg.findByIdAndDelete(id);
    if (!elderCareOrg) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Elder Care Org not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "Elder Care Org deleted successfully")
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Search Elder Care Org
export const searchElderCareOrg = asyncHandler(async (req, res) => {
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

    const elderCareOrgs = await ElderCareOrg.find(searchCriteria)
      .populate("category", "name description")
      .sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          elderCareOrgs,
          "Elder Care Org search results"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Elder Care Org by Pincode
export const getElderCareOrgByPincode = asyncHandler(async (req, res) => {
  try {
    const { pincode } = req.params;

    const medicineShops = await ElderCareOrg.find({
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
          "Elder Care Org by pincode retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});