import { Router } from "express";
import {
    createPrediction,
    validatePredictionCode
} from "../controllers/predictionController.js";

const router = Router();

router.post("/", createPrediction);

router.post("/validate", validatePredictionCode);

export default router;