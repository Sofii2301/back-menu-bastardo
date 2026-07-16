import {
    findCode,
    savePrediction,
    markCodeAsUsed
} from "../services/predictionService.js";

export async function createPrediction(req, res) {

    try {

        const data = req.body;

        const code = await findCode(data.code);

        if (!code) {
            return res.status(404).json({
                ok: false,
                message: "Código inexistente."
            });
        }

        if (code.used) {
            return res.status(400).json({
                ok: false,
                message: "Ese código ya fue utilizado."
            });
        }

        await savePrediction(data);

        await markCodeAsUsed(code.row);

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