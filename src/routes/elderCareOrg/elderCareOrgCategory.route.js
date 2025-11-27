import express from "express";
import {
    createElderCareOrgCategory,
    getAllElderCareOrgCategories,
    getActiveElderCareOrgCategories,
    getElderCareOrgCategoryById,
    updateElderCareOrgCategory,
    deleteElderCareOrgCategory
} from "../../controller/elderCareOrg/elderCareOrgCategory.controller.js";

import { authenticateAdmin } from "../../middleware/admin.auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllElderCareOrgCategories);
router.get("/active", getActiveElderCareOrgCategories);
router.get("/:id", getElderCareOrgCategoryById);

// Protected routes (Admin only)
router.post("/", authenticateAdmin, createElderCareOrgCategory);
router.put("/:id", authenticateAdmin, updateElderCareOrgCategory);
router.delete("/:id", authenticateAdmin, deleteElderCareOrgCategory);

export default router;