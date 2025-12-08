import express from "express";
import {
createPhysiotheripst,
getAllPhysiotheristapist,
getActivePhysiotheristapist,
getPhysiotherapistById,
getPhysiotheristapistByCategory,
updatePhysiotherapist,
deletePhysiotheristapist,
searchPhysiotheristapist,
getPhysiotheristapistByPincode
} from "../../controller/physiotherapist/physiotherapist.controller.js";
import { authenticateAdmin } from "../../middleware/admin.auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllPhysiotheristapist);
router.get("/active", getActivePhysiotheristapist);
router.get("/search", searchPhysiotheristapist);
router.get("/category/:categoryId", getPhysiotheristapistByCategory);
router.get("/pincode/:pincode", getPhysiotheristapistByPincode);
router.get("/:id", getPhysiotherapistById);

// Protected routes (Admin only)
router.post("/", authenticateAdmin, createPhysiotheripst);
router.put("/:id", authenticateAdmin, updatePhysiotherapist);
router.delete("/:id", authenticateAdmin, deletePhysiotheristapist);

export default router;
