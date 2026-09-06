import express from "express";
import {
  obtenerDisciplinas,
  obtenerOpcionesMovimiento,
} from "../controllers/disciplinas.controller.js";

const router = express.Router();

router.get("/", obtenerDisciplinas);
router.get("/opciones-movimiento", obtenerOpcionesMovimiento);

export default router;
