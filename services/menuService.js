import { sheets, spreadsheetId } from "./google.js";

const MENU = "Menú";

// Columnas de la pestaña "Menú":
// id | category | name | description | price | layout | add | option_label | option_add | table_group | table_size
//
// - La primera fila de cada id es el ítem.
// - Las filas siguientes con el mismo id y option_label son sus opciones.
// - Las filas con table_group/table_size arman la tabla (layout = "table"),
//   p. ej. Café: table_group = "Expresso", table_size = "Chico".

function clean(value) {
    if (value === undefined || value === null) return "";
    return typeof value === "string" ? value.trim() : value;
}

function toPrice(value) {
    const v = clean(value);
    if (v === "") return undefined;
    const n = typeof v === "number" ? v : Number(String(v).replace(/[^\d.-]/g, ""));
    return Number.isFinite(n) ? n : undefined;
}

// Quita las claves vacías para que el front reciba lo mismo que en menu.json
function compact(obj) {
    return Object.fromEntries(
        Object.entries(obj).filter(([, v]) => v !== "" && v !== undefined)
    );
}

export function buildMenu(rows) {
    if (rows.length <= 1) return [];

    const headers = rows[0].map(h => String(h).trim());
    const items = [];
    const byId = new Map();
    const tables = new Map();

    for (const raw of rows.slice(1)) {
        const row = {};
        headers.forEach((h, i) => { row[h] = clean(raw[i]); });

        if (row.id === "") continue;
        const id = Number(row.id);
        if (!Number.isFinite(id)) continue;

        const parent = byId.get(id);

        if (parent && row.table_group !== "") {
            const table = tables.get(id);
            const size = String(row.table_size);
            if (!table.columns.includes(size)) table.columns.push(size);
            let tableRow = table.rows.get(row.table_group);
            if (!tableRow) {
                tableRow = {};
                table.rows.set(row.table_group, tableRow);
            }
            tableRow[size] = toPrice(row.price);
            continue;
        }

        if (parent && row.option_label !== "") {
            parent.options ??= [];
            parent.options.push(compact({
                label: String(row.option_label),
                price: toPrice(row.price),
                add: row.option_add
            }));
            continue;
        }

        if (parent) continue; // fila repetida sin datos de opción: se ignora

        const item = compact({
            id,
            name: row.name,
            category: row.category,
            price: toPrice(row.price),
            desc: row.description,
            add: row.add,
            layout: row.layout
        });

        if (item.layout === "table") {
            tables.set(id, { columns: [], rows: new Map() });
        }

        byId.set(id, item);
        items.push(item);
    }

    for (const [id, table] of tables) {
        const item = byId.get(id);
        item.columns = table.columns;
        item.rows = [...table.rows].map(([name, prices]) => ({
            name: String(name),
            prices: table.columns.map(col => prices[col])
        }));
    }

    return items;
}

export async function getMenuItems() {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${MENU}!A:K`,
        valueRenderOption: "UNFORMATTED_VALUE"
    });

    return buildMenu(response.data.values || []);
}
