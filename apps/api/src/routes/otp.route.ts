import { Router } from "express";
import {
  deleteSecret,
  generateOtp,
  listAllSecrets,
  saveSecret,
  updateSecretData,
} from "../controllers/otp.controller";

const router = Router();
// /api/
router.get("/totp/:id", generateOtp);
router.post("/totp", saveSecret);
router.put("/totp/:id", updateSecretData);
router.delete("/totp/:id", deleteSecret);

router.get("/list", listAllSecrets);
export default router;
