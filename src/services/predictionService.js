import { sheets, spreadsheetId } from "../config/google.js";

const PARTICIPANTES = "Participantes";
const CODIGOS = "Codigos";

export async function getCodes() {

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${CODIGOS}!A:B`
    });

    return response.data.values || [];

}

export async function findCode(code) {

    const rows = await getCodes();

    for (let i = 1; i < rows.length; i++) {

        if (rows[i][0] === code) {
            return {
                row: i + 1,
                used: rows[i][1] === "TRUE"
            };
        }

    }

    return null;

}

export async function markCodeAsUsed(row) {

    await sheets.spreadsheets.values.update({

        spreadsheetId,

        range: `${CODIGOS}!B${row}`,

        valueInputOption: "RAW",

        requestBody: {
            values: [["TRUE"]]
        }

    });

}

export async function savePrediction(data) {

    await sheets.spreadsheets.values.append({

        spreadsheetId,

        range: `${PARTICIPANTES}!A:H`,

        valueInputOption: "USER_ENTERED",

        requestBody: {
            values: [[
                new Date().toLocaleString(),
                data.code,
                data.name,
                data.contact,
                data.instagram,
                data.argentina,
                data.españa
            ]]
        }

    });

}

export async function validateCode(code) {

    const response = await fetch(`${API}/prediction/validate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ code })
    });

    return await response.json();

}