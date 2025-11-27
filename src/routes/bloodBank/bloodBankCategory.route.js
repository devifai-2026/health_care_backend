import express from "express";
import {
 createBloodBankCategory,
 getAllBloodBankCategories,
 getActiveBloodBankCategories,
 getBloodBankCategoryById,
 updateBloodBankCategory,
 deleteBloodBankCategory
} from "../../controller/bloodBank/bloodBankCategory.controller.js";

import { authenticateAdmin } from "../../middleware/admin.auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllBloodBankCategories);
router.get("/active", getActiveBloodBankCategories);
router.get("/:id", getBloodBankCategoryById);

// Protected routes (Admin only)
router.post("/", authenticateAdmin, createBloodBankCategory);
router.put("/:id", authenticateAdmin, updateBloodBankCategory);
router.delete("/:id", authenticateAdmin, deleteBloodBankCategory);

export default router;