import express from "express";
import {
createAmbulance,
getAllAmbulance,
getActiveAmbulance,
getAmbulanceById,
getAmbulancebByCategory,
updateAmbulance,
deleteAmbulance,
searchAmbulance,
getAmbulanceByPincode

} from "../../controller/ambulance/ambulance.controller.js";
import { authenticateAdmin } from "../../middleware/admin.auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllAmbulance);
router.get("/active", getActiveAmbulance);
router.get("/search", searchAmbulance);
router.get("/category/:categoryId", getAmbulancebByCategory);
router.get("/pincode/:pincode", getAmbulanceByPincode);
router.get("/:id", getAmbulanceById);

// Protected routes (Admin only)
router.post("/", authenticateAdmin, createAmbulance);
router.put("/:id", authenticateAdmin, updateAmbulance);
router.delete("/:id", authenticateAdmin, deleteAmbulance);

export default router;
