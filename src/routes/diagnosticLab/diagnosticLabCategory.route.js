import express from "express";
import {
  createDiagnosticLabCategory,
  getAllDiagnosticLabCategories,
  getActiveDiagnosticLabCategories,
  getDiagnosticLabCategoryById,
  updateDiagnosticLabCategory,
  deleteDiagnosticLabCategory
} from "../../controller/diagnosticLab/diagnosticCategory.controller.js";

import { authenticateAdmin } from "../../middleware/admin.auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllDiagnosticLabCategories);
router.get("/active", getActiveDiagnosticLabCategories);
router.get("/:id", getDiagnosticLabCategoryById);

// Protected routes (Admin only)
router.post("/", authenticateAdmin, createDiagnosticLabCategory);
router.put("/:id", authenticateAdmin, updateDiagnosticLabCategory);
router.delete("/:id", authenticateAdmin, deleteDiagnosticLabCategory);

export default router;