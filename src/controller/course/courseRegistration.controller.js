import CourseRegistration from "../../models/course/courseRegistration.model.js";
import Course from "../../models/course/course.model.js";

import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import handleMongoErrors from "../../utils/mongooseError.js";
import User from "../../models/user/user.model.js";

// Create Course Registration (User)
export const createCourseRegistration = asyncHandler(async (req, res) => {
  try {
    const {
      course,
      student,
      firstName,
      lastName,
      resume,
      phone,
      email,
      location,
    } = req.body;

    // Validation
    if (
      !course ||
      !student ||
      !firstName ||
      !lastName ||
      !resume ||
      !phone ||
      !email ||
      !location
    ) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "All required fields must be filled"));
    }

    // Check if course exists
    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Course not found"));
    }

    // Check if user exists
    const userExists = await User.findById(student);
    if (!userExists) {
      return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    // Check if user is already registered for this course
    const existingRegistration = await CourseRegistration.findOne({
      course,
      student,
    });

    if (existingRegistration) {
      return res
        .status(409)
        .json(
          new ApiResponse(
            409,
            null,
            "You are already registered for this course"
          )
        );
    }

    // Create new registration
    const registration = new CourseRegistration({
      course,
      student,
      firstName,
      lastName,
      resume,
      phone,
      email,
      location,
    });

    await registration.save();
    await registration.populate("course", "title instructor");
    await registration.populate("student", "name email");

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          registration,
          "Course registration submitted successfully"
        )
      );
  } catch (error) {
    console.log(error.message);
    return handleMongoErrors(error, res);
  }
});

// Get All Course Registrations (Admin only)
export const getAllCourseRegistrations = asyncHandler(async (req, res) => {
  try {
    const { course, student } = req.query;

    const filter = {};
    if (course) {
      filter.course = course;
    }
    if (student) {
      filter.student = student;
    }

    const registrations = await CourseRegistration.find(filter)
      .populate({
        path: "course",
        select: "title instructor category duration price images", // Add other fields you need
        populate: {
          path: "category",
          select: "name description isActive", // Populate category details
        },
      })
      .populate("student", "name email phone")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          registrations,
          "Registrations retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});


// Get Course Registration by ID
export const getCourseRegistrationById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await CourseRegistration.findById(id)
      .populate("course", "title instructor category duration price")
      .populate("student", "name email phone");

    if (!registration) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Registration not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          registration,
          "Registration retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get User's Course Registrations
export const getUserCourseRegistrations = asyncHandler(async (req, res) => {
  try {
    const student = req.user._id; // Assuming user is authenticated

    const registrations = await CourseRegistration.find({ student })
      .populate("course", "title instructor category duration price")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          registrations,
          "Your course registrations retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Update Course Registration (Admin only)
export const updateCourseRegistration = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const registration = await CourseRegistration.findById(id);
    if (!registration) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Registration not found"));
    }

    // Update description if provided
    if (description !== undefined) {
      registration.description = description;
    }

    await registration.save();
    await registration.populate("course", "title instructor");
    await registration.populate("student", "name email");

    return res
      .status(200)
      .json(
        new ApiResponse(200, registration, "Registration updated successfully")
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Delete Course Registration (Admin only)
export const deleteCourseRegistration = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await CourseRegistration.findById(id);
    if (!registration) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Registration not found"));
    }

    await CourseRegistration.findByIdAndDelete(id);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Registration deleted successfully"));
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get Registrations by Course ID (Admin only)
export const getRegistrationsByCourseId = asyncHandler(async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if course exists
    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Course not found"));
    }

    const registrations = await CourseRegistration.find({ course: courseId })
      .populate("student", "name email phone")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          registrations,
          "Course registrations retrieved successfully"
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});
