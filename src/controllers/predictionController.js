import { getCodes } from "../services/predictionService.js";

export async function createPrediction(req, res) {

    const codes = await getCodes();

    console.log(codes);

    res.json({
        ok: true
    });

}