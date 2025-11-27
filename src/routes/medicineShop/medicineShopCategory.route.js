import express from "express";
import {
  createMedicineShopCategory,
  getAllMedicineShopCategories,
  getActiveMedicineShopCategories,
  getMedicineShopCategoryById,
  updateMedicineShopCategory,
  deleteMedicineShopCategory
} from "../../controller/medicineShop/medicineShopCategory.controller.js";

import { authenticateAdmin } from "../../middleware/admin.auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllMedicineShopCategories);
router.get("/active", getActiveMedicineShopCategories);
router.get("/:id", getMedicineShopCategoryById);

// Protected routes (Admin only)
router.post("/", authenticateAdmin, createMedicineShopCategory);
router.put("/:id", authenticateAdmin, updateMedicineShopCategory);
router.delete("/:id", authenticateAdmin, deleteMedicineShopCategory);

export default router;