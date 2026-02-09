import express from "express";
import {
  createDietitian,
  getAllDietitian,
  getActiveDietitian,
  getDietitianById,
  getDietitianByCategory,
  updateDietitian,
  deleteDietitian,
  searchDietitian,
  getDietitianByPincode
} from "../../controller/dietitian/dietitian.controller.js";
import { authenticateAdmin } from "../../middleware/admin.auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllDietitian);
router.get("/active", getActiveDietitian);
router.get("/search", searchDietitian);
router.get("/category/:categoryId", getDietitianByCategory);
router.get("/pincode/:pincode", getDietitianByPincode);
router.get("/:id", getDietitianById);

// Protected routes (Admin only)
router.post("/", authenticateAdmin, createDietitian);
router.put("/:id", authenticateAdmin, updateDietitian);
router.delete("/:id", authenticateAdmin, deleteDietitian);

export default router;
