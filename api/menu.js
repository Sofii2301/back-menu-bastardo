import { getMenuItems } from "../services/menuService.js";

export default async function handler(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*"); //https://menu-bastardo.vercel.app
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "GET") {
        return res.status(405).json({
            ok: false,
            message: "Método no permitido"
        });
    }

    try {

        const items = await getMenuItems();

        // Vercel cachea la respuesta 60 s; los cambios en la hoja se ven en ~1 min
        res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");

        return res.status(200).json({
            ok: true,
            items
        });

    } catch (error) {

        console.error("❌ Error en /api/menu:", error);

        return res.status(500).json({
            ok: false,
            message: "No se pudo obtener el menú."
        });

    }

}