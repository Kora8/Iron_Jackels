import express from "express";
import {
  obtenerRutinas,
  crearRutina,
} from "../controllers/rutinas.controller.js";

const router = express.Router();

router.get("/", obtenerRutinas);
router.post("/", crearRutina);

export default router;
