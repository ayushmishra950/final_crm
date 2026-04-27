import express from "express";
import { 
    createService, 
    getVendorServices, 
    updateService, 
    deleteService 
} from "../controllers/service.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = express.Router();

// Public routes (for users to see services)
router.get("/vendor/:vendorId", getVendorServices); // You might want a different route for public view later

// Protected vendor routes
router.use(isAuthenticated);

router.post("/create", createService);
router.get("/my-services", getVendorServices);
router.put("/update/:id", updateService);
router.delete("/delete/:id", deleteService);

export default router;
