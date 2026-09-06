import express from "express";
import multer from "multer";
import path from "node:path";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  obtenerMovimientos,
  obtenerMovimiento,
  crearMovimiento,
} from "../controllers/movimientos.controller.js";

const router = express.Router();
const uploadDirectory = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "uploads",
  "movimientos",
);

const tiposPermitidos = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/webm",
]);

const upload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, callback) => {
      try {
        await mkdir(uploadDirectory, { recursive: true });
        callback(null, uploadDirectory);
      } catch (error) {
        callback(error);
      }
    },
    filename: (req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      const baseName =
        path
          .basename(file.originalname, extension)
          .replace(/[^a-z0-9]+/gi, "-")
          .replace(/^-|-$/g, "")
          .toLowerCase() || "media";
      callback(null, `${baseName}-${Date.now()}${extension}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    callback(null, tiposPermitidos.has(file.mimetype));
  },
  limits: { fileSize: 50 * 1024 * 1024, files: 1 },
});

router.get("/", obtenerMovimientos);
router.get("/:id", obtenerMovimiento);
router.post("/", upload.single("media"), crearMovimiento);

export default router;
