import express from "express";
import {
createPhysiotherapistCategory,
getAllPhysiotherapistCategories,
getActivePhysiotherapistCategories,
getPhysiotherapistCategoryById,
updatePhysiotherapistCategory,
deletePhysiotherapistCategory
} from "../../controller/physiotherapist/physiotherapistCategory.controller.js";

import { authenticateAdmin } from "../../middleware/admin.auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllPhysiotherapistCategories);
router.get("/active", getActivePhysiotherapistCategories);
router.get("/:id", getPhysiotherapistCategoryById);

// Protected routes (Admin only)
router.post("/", authenticateAdmin, createPhysiotherapistCategory);
router.put("/:id", authenticateAdmin, updatePhysiotherapistCategory);
router.delete("/:id", authenticateAdmin, deletePhysiotherapistCategory);

export default router;