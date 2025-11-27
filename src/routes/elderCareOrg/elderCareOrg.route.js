import express from "express";
import {
  createElderCareOrg,
  getAllElderCareOrg,
  getActiveElderCareOrg,
  getElderCareOrgById,
  getElderCareOrgByCategory,
  updateElderCareOrg,
  deleteElderCareOrg,
  searchElderCareOrg,
  getElderCareOrgByPincode
} from "../../controller/elderCareOrg/elderCareOrg.controller.js";
import { authenticateAdmin } from "../../middleware/admin.auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllElderCareOrg);
router.get("/active", getActiveElderCareOrg);
router.get("/search", searchElderCareOrg);
router.get("/category/:categoryId", getElderCareOrgByCategory);
router.get("/pincode/:pincode", getElderCareOrgByPincode);
router.get("/:id", getElderCareOrgById);

// Protected routes (Admin only)
router.post("/", authenticateAdmin, createElderCareOrg);
router.put("/:id", authenticateAdmin, updateElderCareOrg);
router.delete("/:id", authenticateAdmin, deleteElderCareOrg);

export default router;
