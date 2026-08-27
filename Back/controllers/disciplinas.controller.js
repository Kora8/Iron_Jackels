import pool from "../database.js";

export const obtenerDisciplinas = async (req, res) => {
  try {
    const [disciplinas] = await pool.query(`
      SELECT id, slug, nombre, categoria, color, imagen_url AS imagenUrl
      FROM disciplinas
      ORDER BY id
    `);
    res.json(disciplinas);
  } catch (error) {
    console.error("Error al obtener disciplinas:", error);
    res.status(500).json({ error: "No se pudieron obtener las disciplinas" });
  }
};
