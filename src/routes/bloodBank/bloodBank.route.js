import express from "express";
import {
 createBloodBank,
 getAllBloodBank,
 getActiveBloodBank,
 getBloodBankById,
 getBloodBanksByCategory,
 updateBloodBank,
 deleteBloodBankCenter,
 searchBloodBank,
 getBloodBankByPincode
} from "../../controller/bloodBank/bloodBank.controller.js";
import { authenticateAdmin } from "../../middleware/admin.auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllBloodBank);
router.get("/active", getActiveBloodBank);
router.get("/search", searchBloodBank);
router.get("/category/:categoryId", getBloodBanksByCategory);
router.get("/pincode/:pincode", getBloodBankByPincode);
router.get("/:id", getBloodBankById);

// Protected routes (Admin only)
router.post("/", authenticateAdmin, createBloodBank);
router.put("/:id", authenticateAdmin, updateBloodBank);
router.delete("/:id", authenticateAdmin, deleteBloodBankCenter);

export default router;
