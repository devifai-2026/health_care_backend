import express from "express";
import {
createAyaCategory,
getAllAyaCategories,
getActiveAyaCategories,
getAyaCategoryById,
updateAyaCategory,
deleteAyaCategory
} from "../../controller/aya/ayaCategory.controller.js";

import { authenticateAdmin } from "../../middleware/admin.auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllAyaCategories);
router.get("/active", getActiveAyaCategories);
router.get("/:id", getAyaCategoryById);

// Protected routes (Admin only)
router.post("/", authenticateAdmin, createAyaCategory);
router.put("/:id", authenticateAdmin, updateAyaCategory);
router.delete("/:id", authenticateAdmin, deleteAyaCategory);

export default router;