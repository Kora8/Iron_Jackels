import express from "express";
import { obtenerDisciplinas } from "../controllers/disciplinas.controller.js";

const router = express.Router();

router.get("/", obtenerDisciplinas);

export default router;