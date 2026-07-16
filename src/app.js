import express from "express";
import cors from "cors";

import predictionRoutes from "./routes/predictionRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/prediction", predictionRoutes);

app.get("/test", (req, res) => {
    res.send("OK");
});

export default app;