import express from "express";
import {
 createAyaService,
 getAllAyaService,
 getActiveAyaService,
 getAyaServiceById,
 getAyaServiceByCategory,
 updateAyaService,
 deleteAyaService,
 searchAyaService,
 getAyaServiceByPincode
} from "../../controller/aya/ayaService.controller.js";
import { authenticateAdmin } from "../../middleware/admin.auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllAyaService);
router.get("/active", getActiveAyaService);
router.get("/search", searchAyaService);
router.get("/category/:categoryId", getAyaServiceByCategory);
router.get("/pincode/:pincode", getAyaServiceByPincode);
router.get("/:id", getAyaServiceById);

// Protected routes (Admin only)
router.post("/", authenticateAdmin, createAyaService);
router.put("/:id", authenticateAdmin, updateAyaService);
router.delete("/:id", authenticateAdmin, deleteAyaService);

export default router;
