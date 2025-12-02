import express from "express";
import {
 createDiagnosticLab,
 getAllDiagnosticLab,
 getActiveDiagnosticLab,
 getDiagnosticLabById,
 getDiagnosticLabByCategory,
 updateDiagnosticLab,
 deleteDiagnosticLab,
 searchDiagnosticLab,
 getDiagnosticLabByPincode
} from "../../controller/diagnosticLab/diagnosticLab.controller.js";
import { authenticateAdmin } from "../../middleware/admin.auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllDiagnosticLab);
router.get("/active", getActiveDiagnosticLab);
router.get("/search", searchDiagnosticLab);
router.get("/category/:categoryId", getDiagnosticLabByCategory);
router.get("/pincode/:pincode", getDiagnosticLabByPincode);
router.get("/:id", getDiagnosticLabById);

// Protected routes (Admin only)
router.post("/", authenticateAdmin, createDiagnosticLab);
router.put("/:id", authenticateAdmin, updateDiagnosticLab);
router.delete("/:id", authenticateAdmin, deleteDiagnosticLab);

export default router;
