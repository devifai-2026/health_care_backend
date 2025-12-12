import mongoose from "mongoose";

const courseRegistrationSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

const CourseRegistration = mongoose.model(
  "CourseRegistration",
  courseRegistrationSchema
);

export default CourseRegistration;
