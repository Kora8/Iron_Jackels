import express from "express";
import multer from "multer";
import {
  obtenerMovimientos,
  obtenerMovimiento,
  crearMovimiento,
} from "../controllers/movimientos.controller.js";

const router = express.Router();
const tiposPermitidos = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/webm",
]);

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, callback) => {
    callback(null, tiposPermitidos.has(file.mimetype));
  },
  limits: { fileSize: 50 * 1024 * 1024, files: 1 },
});

router.get("/", obtenerMovimientos);
router.get("/:id", obtenerMovimiento);
router.post("/", upload.single("media"), crearMovimiento);

export default router;
