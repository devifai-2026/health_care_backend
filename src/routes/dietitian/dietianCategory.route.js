import express from "express";
import {
    createDietitianCategory,
    getAllDietitianCategories,
    getActiveDietitianCategories,
    getDietitianCategoryById,
    updateDietitianCategory,
    deleteDietitianCategory
} from "../../controller/dietitian/dietitianCategory.controller.js";

import { authenticateAdmin } from "../../middleware/admin.auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllDietitianCategories);
router.get("/active", getActiveDietitianCategories);
router.get("/:id", getDietitianCategoryById);

// Protected routes (Admin only)
router.post("/", authenticateAdmin, createDietitianCategory);
router.put("/:id", authenticateAdmin, updateDietitianCategory);
router.delete("/:id", authenticateAdmin, deleteDietitianCategory);

export default router;