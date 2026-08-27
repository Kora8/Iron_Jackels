import express from "express";
import {
  obtenerMovimientos,
  crearMovimiento,
} from "../controllers/movimientos.controller.js";

const router = express.Router();

router.get("/", obtenerMovimientos);
router.post("/", crearMovimiento);

export default router;