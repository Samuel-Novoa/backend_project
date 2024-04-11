import { Router } from "express";
import * as authController from "../../controllers/auth";

const router = Router();
//get role
router.post("/verifytoken", authController.getDataById);
//auth routes
router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
//forgot auth routes
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

export default router;
