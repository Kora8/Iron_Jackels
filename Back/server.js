import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./database.js";
import disciplinasRoutes from "./routes/disciplinas.routes.js";
import movimientosRoutes from "./routes/movimientos.routes.js";
import rutinasRoutes from "./routes/rutinas.routes.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/api/disciplinas", disciplinasRoutes);
app.use("/api/movimientos", movimientosRoutes);
app.use("/api/rutinas", rutinasRoutes);

app.get("/", (req, res) => {
    res.json({
        mensaje: "API de Iron Jackals funcionando"
    });
});

app.get("/api/prueba-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM disciplinas");
    res.json(rows);
  } catch (error) {
    console.error("Error de MySQL:", error);
    res.status(500).json({ error: "No se pudo conectar con MySQL" });
  }
});

app.listen(PORT, () => {
    console.log(`Servidor Iron Jackals ejecutándose en http://localhost:${PORT}`);
});