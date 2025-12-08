import express from "express";
import cors from "cors";
import errorHandler from "./middleware/error.middleware.js";

// Initialize Express app
const app = express();

// Middleware configuration
const corsOptions = {
  origin: function (origin, callback) {
    callback(null, origin);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Health check route (✅ IMPORTANT for Render)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Health Care API is healthy!",
    timestamp: new Date().toISOString()
  });
});

// imports api
import adminApi from "./routes/admin/admin.routes.js";
import userApi from "./routes/user/user.routes.js";
import healthCenterApi from "./routes/health/healthCare.routes.js";
import healthCategoryApi from "./routes/health/healthCategory.routes.js";
import doctorApi from "./routes/doctor/doctor.routes.js";
import doctorCategoryApi from "./routes/doctor/doctorCategory.routes.js";
import bookingApi from "./routes/bookingAppointment/booking.routes.js";
import jobApi from "./routes/job/job.routes.js";
import jobCategoryApi from "./routes/job/jobCategory.routes.js";
import jobApplicationApi from "./routes/job/jobApplication.routes.js";
import blogApi from "./routes/blog/blog.routes.js";
import courseApi from "./routes/course/course.routes.js";
import courseCategoryApi from "./routes/course/courseCategory.routes.js";
import courseRegistrationApi from "./routes/course/courseRegistration.routes.js";
import medicineShopCategory from "./routes/medicineShop/medicineShopCategory.route.js";
import medicineShop from "./routes/medicineShop/medicineShop.route.js";
import bloodBankCategory from "./routes/bloodBank/bloodBankCategory.route.js";
import bloodBank from "./routes/bloodBank/bloodBank.route.js";
import elderCareOrgCategory from "./routes/elderCareOrg/elderCareOrgCategory.route.js";
import elderCareOrg from "./routes/elderCareOrg/elderCareOrg.route.js";
import diagnosticLabCategory from "./routes/diagnosticLab/diagnosticLabCategory.route.js";
import diagnosticLab from "./routes/diagnosticLab/diagnosticLab.route.js";
import ambulanceCategory from "./routes/ambulance/ambulanceCategory.route.js";
import ambulance from "./routes/ambulance/ambulance.route.js";
import AyaCategory from "./routes/aya/ayaCategory.route.js";
import AyaService from "./routes/aya/ayaService.route.js";
import PhysiotherapistCategory from "./routes/physiotherapist/physiotherapistCategory.route.js";
import Physiotherapist from "./routes/physiotherapist/physiotherapist.route.js";

app.use("/api/v1/admin", adminApi);
app.use("/api/v1/user", userApi);
app.use("/api/v1/healthcare-centers", healthCenterApi);
app.use("/api/v1/health-categories", healthCategoryApi);
app.use("/api/v1/doctor-categories", doctorCategoryApi);
app.use("/api/v1/doctors", doctorApi);
app.use("/api/v1/blogs", blogApi);
app.use("/api/v1/jobs", jobApi);
app.use("/api/v1/job-categories", jobCategoryApi);
app.use("/api/v1/job-applications", jobApplicationApi); // not done
app.use("/api/v1/bookings", bookingApi); // not done
app.use("/api/v1/courses", courseApi);
app.use("/api/v1/course-categories", courseCategoryApi);
app.use("/api/v1/course-registrations", courseRegistrationApi); // not done
app.use("/api/v1/medicineshop-categories", medicineShopCategory)
app.use("/api/v1/medicine-shops", medicineShop);
app.use("/api/v1/bloodBank-categories", bloodBankCategory);
app.use("/api/v1/blood-banks", bloodBank);
app.use("/api/v1/elderCareOrg-categories", elderCareOrgCategory);
app.use("/api/v1/elderCare-org", elderCareOrg);
app.use("/api/v1/diagnosticLab-categories", diagnosticLabCategory);
app.use("/api/v1/diagnostic-lab", diagnosticLab);
app.use("/api/v1/ambulance-categories", ambulanceCategory);
app.use("/api/v1/ambulance", ambulance);
app.use("/api/v1/aya-categories", AyaCategory);
app.use("/api/v1/aya-service", AyaService);
app.use("/api/v1/physiotherapist-categories", PhysiotherapistCategory);
app.use("/api/v1/physiotherapist", Physiotherapist);

// Home route
app.get("/", (req, res) => {
  res.json({ 
    message: "Welcome To HealthCare API!",
    version: "1.0.0",
    status: "active",
    timestamp: new Date().toISOString()
  });
});

// ✅ Error handler should be last
app.use(errorHandler);

export default app;