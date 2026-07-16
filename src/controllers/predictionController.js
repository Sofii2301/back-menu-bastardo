import {
    findCode,
    savePrediction,
    markCodeAsUsed
} from "../services/predictionService.js";

async function validateCode(code) {

    const result = await findCode(code);

    if (!result) {
        return {
            ok: false,
            status: 404,
            message: "Código inexistente."
        };
    }

    if (result.used) {
        return {
            ok: false,
            status: 400,
            message: "Ese código ya fue utilizado."
        };
    }

    return {
        ok: true,
        row: result.row
    };

}

export async function validatePredictionCode(req, res) {
    console.log("Entró al endpoint validate");
    try {

        const validation = await validateCode(req.body.code);

        if (!validation.ok) {
            return res.status(validation.status).json(validation);
        }

        return res.json({
            ok: true
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor."
        });

    }

}

export async function createPrediction(req, res) {

    try {

        const data = req.body;

        const validation = await validateCode(data.code);

        if (!validation.ok) {
            return res.status(validation.status).json(validation);
        }

        await savePrediction(data);

        await markCodeAsUsed(validation.row);

        return res.json({
            ok: true,
            message: "¡Participación registrada!"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor."
        });

    }

}