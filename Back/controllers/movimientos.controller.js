import pool from "../database.js";
import { unlink } from "node:fs/promises";

const seleccionarMovimiento = `
  SELECT
    m.id,
    m.nombre,
    m.disciplina_id AS disciplinaId,
    m.tipo_movimiento_id AS tipoMovimientoId,
    m.finalidad_id AS finalidadId,
    m.dificultad_id AS dificultadId,
    m.modo_entrenamiento_id AS modoEntrenamientoId,
    m.media_url AS mediaUrl,
    d.slug AS disciplinaSlug,
    d.nombre AS disciplinaNombre,
    tm.nombre AS tipo,
    f.nombre AS finalidad,
    dif.nombre AS dificultad,
    me.nombre AS modo
  FROM movimientos m
  JOIN disciplinas d ON d.id = m.disciplina_id
  JOIN tipos_movimiento tm ON tm.id = m.tipo_movimiento_id
  JOIN finalidades f ON f.id = m.finalidad_id
  JOIN dificultades dif ON dif.id = m.dificultad_id
  JOIN modos_entrenamiento me ON me.id = m.modo_entrenamiento_id
`;

export const obtenerMovimientos = async (req, res) => {
  try {
    const [movimientos] = await pool.query(
      `${seleccionarMovimiento} ORDER BY m.id`,
    );
    res.json(movimientos);
  } catch (error) {
    console.error("Error al obtener movimientos:", error);
    res.status(500).json({ error: "No se pudieron obtener los movimientos" });
  }
};

export const obtenerMovimiento = async (req, res) => {
  try {
    const [movimientos] = await pool.query(
      `${seleccionarMovimiento} WHERE m.id = ?`,
      [req.params.id],
    );
    if (!movimientos.length) {
      return res
        .status(404)
        .json({ ok: false, mensaje: "Movimiento no encontrado" });
    }
    res.json(movimientos[0]);
  } catch (error) {
    console.error("Error al obtener movimiento:", error);
    res
      .status(500)
      .json({ ok: false, mensaje: "No se pudo obtener el movimiento" });
  }
};

export const crearMovimiento = async (req, res) => {
  let mediaPath;
  try {
    const {
      nombre,
      disciplina_id: disciplinaId,
      tipo_movimiento_id: tipoMovimientoId,
      finalidad_id: finalidadId,
      dificultad_id: dificultadId,
      modo_entrenamiento_id: modoEntrenamientoId,
    } = req.body || {};
    if (
      !nombre?.trim() ||
      !disciplinaId ||
      !tipoMovimientoId ||
      !finalidadId ||
      !dificultadId ||
      !modoEntrenamientoId ||
      !req.file
    ) {
      return res
        .status(400)
        .json({
          ok: false,
          mensaje: "Todos los campos y la multimedia son obligatorios",
        });
    }

    mediaPath = `/uploads/movimientos/${req.file.filename}`;
    const [result] = await pool.query(
      "INSERT INTO movimientos (nombre, disciplina_id, tipo_movimiento_id, finalidad_id, dificultad_id, modo_entrenamiento_id, media_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        nombre.trim(),
        disciplinaId,
        tipoMovimientoId,
        finalidadId,
        dificultadId,
        modoEntrenamientoId,
        mediaPath,
      ],
    );
    const [movimientos] = await pool.query(
      `${seleccionarMovimiento} WHERE m.id = ?`,
      [result.insertId],
    );
    res.status(201).json({ ok: true, movimiento: movimientos[0] });
  } catch (error) {
    console.error("Error al crear movimiento:", error);
    if (req.file) {
      await unlink(req.file.path).catch(() => {});
    }
    res
      .status(500)
      .json({ ok: false, mensaje: "No se pudo crear el movimiento" });
  }
};
