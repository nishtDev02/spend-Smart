import express from "express";
import { getAllInsights } from "../controllers/aiController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/insights", protect, getAllInsights);

export default router;
