import express from "express";
import {
  createMedineShop,
  getAllMedicineShop,
  getActiveMedicineShop,
  getMedicineShopById,
  getMedicineShopByPincode,
  searchMedicineShop,
  deleteMedicineShopCenter,
  updateMedicineShop,
  getMedicineShopsByCategory
} from "../../controller/medicineShop/medicineShop.controller.js";
import { authenticateAdmin } from "../../middleware/admin.auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllMedicineShop);
router.get("/active", getActiveMedicineShop);
router.get("/search", searchMedicineShop);
router.get("/category/:categoryId", getMedicineShopsByCategory);
router.get("/pincode/:pincode", getMedicineShopByPincode);
router.get("/:id", getMedicineShopById);

// Protected routes (Admin only)
router.post("/", authenticateAdmin, createMedineShop);
router.put("/:id", authenticateAdmin, updateMedicineShop);
router.delete("/:id", authenticateAdmin, deleteMedicineShopCenter);

export default router;
