import pool from "../database.js";

export const obtenerMovimientos = async (req, res) => {
  try {
    const [movimientos] = await pool.query(`
      SELECT id, slug, nombre, descripcion, imagen_url AS imagenUrl, disciplina_id AS disciplinaId
      FROM movimientos
      ORDER BY id
    `);
    res.json(movimientos);
  } catch (error) {
    console.error("Error al obtener movimientos:", error);
    res.status(500).json({ error: "No se pudieron obtener los movimientos" });
  }
};

export const crearMovimiento = async (req, res) => {
  try {
    const { nombre, descripcion, imagenUrl, disciplinaId } = req.body;
    const [result] = await pool.query(
      "INSERT INTO movimientos (nombre, descripcion, imagen_url, disciplina_id) VALUES (?, ?, ?, ?)",
      [nombre, descripcion, imagenUrl, disciplinaId],
    );
    res
      .status(201)
      .json({
        id: result.insertId,
        nombre,
        descripcion,
        imagenUrl,
        disciplinaId,
      });
  } catch (error) {
    console.error("Error al crear movimiento:", error);
    res.status(500).json({ error: "No se pudo crear el movimiento" });
  }
};
