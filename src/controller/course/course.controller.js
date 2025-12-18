import Course from "../../models/course/course.model.js";
import CourseCategory from "../../models/course/courseCategory.model.js";
import CourseRegistration from "../../models/course/courseRegistration.model.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import handleMongoErrors from "../../utils/mongooseError.js";

// Create Course (Admin only)
export const createCourse = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      instructor,
      duration,
      price,
      isActive,
      images,
    } = req.body;

    // Validation
    if (
      !title ||
      !category ||
      !description ||
      !instructor ||
      !duration ||
      !price
    ) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "All fields are required"));
    }

    // Check if category exists
    const categoryExists = await CourseCategory.findById(category);
    if (!categoryExists) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Category not found"));
    }

    // Check if course already exists with same title
    const existingCourse = await Course.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") },
    });
    if (existingCourse) {
      return res
        .status(409)
        .json(
          new ApiResponse(409, null, "Course with this title already exists")
        );
    }

    // Create new course
    const course = new Course({
      title,
      category,
      description,
      instructor,
      duration,
      price,
      isActive: isActive || false,
      images: images || [],
    });

    await course.save();
    await course.populate("category", "name");

    return res
      .status(201)
      .json(new ApiResponse(201, course, "Course created successfully"));
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Get All Courses
export const getAllCourses = asyncHandler(async (req, res) => {
  try {
    const { isActive, category } = req.query;

    const filter = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }
    if (category) {
      filter.category = category;
    }

    const courses = await Course.find(filter)
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(200, courses, "Courses retrieved successfully"));
  } catch (error) {
    console.log(error.message);
    return handleMongoErrors(error, res);
  }
});

// Get Course by ID
export const getCourseById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id).populate(
      "category",
      "name description"
    );

    if (!course) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Course not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, course, "Course retrieved successfully"));
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Update Course (Admin only)
export const updateCourse = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      category,
      description,
      instructor,
      duration,
      price,
      isActive,
      images,
    } = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Course not found"));
    }

    // Check if category exists (if being updated)
    if (category) {
      const categoryExists = await CourseCategory.findById(category);
      if (!categoryExists) {
        return res
          .status(404)
          .json(new ApiResponse(404, null, "Category not found"));
      }
    }

    // Check if trying to set isActive to false when course registrations exist
    if (isActive === false) {
      const courseRegistrationCount = await CourseRegistration.countDocuments({
        course: id,
      });

      if (courseRegistrationCount > 0) {
        return res
          .status(400)
          .json(
            new ApiResponse(
              400,
              null,
              `Cannot deactivate course. ${courseRegistrationCount} student(s) are registered for this course.`
            )
          );
      }
    }

    // Check if new title already exists (excluding current course)
    if (title && title !== course.title) {
      const existingCourse = await Course.findOne({
        title: { $regex: new RegExp(`^${title}$`, "i") },
        _id: { $ne: id },
      });
      if (existingCourse) {
        return res
          .status(409)
          .json(
            new ApiResponse(409, null, "Course with this title already exists")
          );
      }
    }

    // Update fields
    if (title !== undefined) course.title = title;
    if (category !== undefined) course.category = category;
    if (description !== undefined) course.description = description;
    if (instructor !== undefined) course.instructor = instructor;
    if (duration !== undefined) course.duration = duration;
    if (price !== undefined) course.price = price;
    if (isActive !== undefined) course.isActive = isActive;
    if (images !== undefined) course.images = images;

    await course.save();
    await course.populate("category", "name");

    return res
      .status(200)
      .json(new ApiResponse(200, course, "Course updated successfully"));
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Delete Course (Admin only)
export const deleteCourse = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    // Check if any application exists for this job
    const courseApplicationExists = await CourseRegistration.exists({ course: id });
    // change `job` to your actual field name if different

    if (courseApplicationExists) {
      return res.status(400).json(
        new ApiResponse(
          400,
          null,
          "Course cannot be deleted because applications already exist"
        )
      );
    }

    // 2️⃣ Delete job only if no applications found

    const course = await Course.findById(id);
    if (!course) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Course not found"));
    }

    await Course.findByIdAndDelete(id);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Course deleted successfully"));
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});

// Toggle Course Status (Admin only)
export const toggleCourseStatus = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Course not found"));
    }
    

    const courseRegistrationCount = await CourseRegistration.countDocuments({
      course: id,
    });

    if (courseRegistrationCount > 0) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            `Cannot deactivate course. ${courseRegistrationCount} student(s) are registered for this course.`
          )
        );
    }


    course.isActive = !course.isActive;
    await course.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          course,
          `Course ${course.isActive ? "activated" : "deactivated"} successfully`
        )
      );
  } catch (error) {
    return handleMongoErrors(error, res);
  }
});
