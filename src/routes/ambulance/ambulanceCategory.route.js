import express from "express";
import {
    createAmbulanceCategory,
    getAllAmbulanceCategories,
    getActiveAmbulanceCategories,
    getAmbulanceCategoryById,
    updateAmbulanceCategory,
    deleteAmbulanceCategory
} from "../../controller/ambulance/ambulanceCategory.controller.js";

import { authenticateAdmin } from "../../middleware/admin.auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllAmbulanceCategories);
router.get("/active", getActiveAmbulanceCategories);
router.get("/:id", getAmbulanceCategoryById);

// Protected routes (Admin only)
router.post("/", authenticateAdmin, createAmbulanceCategory);
router.put("/:id", authenticateAdmin, updateAmbulanceCategory);
router.delete("/:id", authenticateAdmin, deleteAmbulanceCategory);

export default router;