import { Router } from "express";
import { createPrediction } from "../controllers/predictionController.js";

const router = Router();

router.post("/", createPrediction);

export default router;