import {
    findCode,
    savePrediction,
    markCodeAsUsed
} from "../services/predictionService.js";

export default async function handler(req, res) {

    // CORS
    res.setHeader("Access-Control-Allow-Origin", "https://menu-bastardo.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({
            ok: false,
            message: "Método no permitido."
        });
    }

    try {

        const data = req.body;

        if (!data.code) {
            return res.status(400).json({
                ok: false,
                message: "Código requerido."
            });
        }

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

        return res.status(200).json({
            ok: true,
            message: "¡Participación registrada!"
        });

    } catch (error) {

        console.error("❌ Error en prediction:", error);

        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor."
        });

    }

}