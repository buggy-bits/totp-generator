import { Router } from "express";
import { greetByName } from "../controllers/test.controller";

const router = Router();
// the route /
router.get("/health", greetByName);

export default router;
