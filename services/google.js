import { google } from "googleapis";

if (!process.env.GOOGLE_SERVICE_ACCOUNT) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT no está definida");
}

const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: [
        "https://www.googleapis.com/auth/spreadsheets"
    ]
});

const client = await auth.getClient();

export const sheets = google.sheets({
    version: "v4",
    auth: client
});

export const spreadsheetId = process.env.SPREADSHEET_ID;