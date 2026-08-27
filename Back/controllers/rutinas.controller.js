import pool from "../database.js";

export const obtenerRutinas = async (req, res) => {
  try {
    const [rutinas] = await pool.query(`
      SELECT id, nombre, descripcion, imagen_url AS imagenUrl
      FROM rutinas
      ORDER BY id
    `);
    res.json(rutinas);
  } catch (error) {
    console.error("Error al obtener rutinas:", error);
    res.status(500).json({ error: "No se pudieron obtener las rutinas" });
  }
};

export const crearRutina = async (req, res) => {
  try {
    const { nombre, descripcion, imagenUrl } = req.body;
    const [result] = await pool.query(
      "INSERT INTO rutinas (nombre, descripcion, imagen_url) VALUES (?, ?, ?)",
      [nombre, descripcion, imagenUrl],
    );
    res
      .status(201)
      .json({ id: result.insertId, nombre, descripcion, imagenUrl });
  } catch (error) {
    console.error("Error al crear rutina:", error);
    res.status(500).json({ error: "No se pudo crear la rutina" });
  }
};
