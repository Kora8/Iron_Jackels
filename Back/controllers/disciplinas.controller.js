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

export const obtenerOpcionesMovimiento = async (req, res) => {
  try {
    const [disciplinas] = await pool.query(
      "SELECT id, slug, nombre, categoria, color, imagen_url AS imagenUrl FROM disciplinas ORDER BY id",
    );
    const [tipos] = await pool.query(
      "SELECT id, disciplina_id AS disciplinaId, nombre FROM tipos_movimiento ORDER BY id",
    );
    const [finalidades] = await pool.query(
      "SELECT id, nombre FROM finalidades ORDER BY id",
    );
    const [dificultades] = await pool.query(
      "SELECT id, nombre FROM dificultades ORDER BY id",
    );
    const [modos] = await pool.query(
      "SELECT id, nombre FROM modos_entrenamiento ORDER BY id",
    );

    res.json({
      disciplinas: disciplinas.map((disciplina) => ({
        ...disciplina,
        tiposMovimiento: tipos.filter(
          (tipo) => tipo.disciplinaId === disciplina.id,
        ),
      })),
      finalidades,
      dificultades,
      modosEntrenamiento: modos,
    });
  } catch (error) {
    console.error("Error al obtener opciones de movimiento:", error);
    res
      .status(500)
      .json({ ok: false, mensaje: "No se pudieron obtener las opciones" });
  }
};
