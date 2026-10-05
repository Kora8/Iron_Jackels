import { createReadStream } from "node:fs";
import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backDirectory = path.resolve(__dirname, "..");
const uploadsDirectory = path.join(backDirectory, "uploads", "movimientos");
const mediaPrefix = "/uploads/movimientos/";

const subirArchivo = (filePath) =>
  new Promise((resolve, reject) => {
    const fileStream = createReadStream(filePath);
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "iron-jackals/movimientos",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    fileStream.on("error", (error) => {
      uploadStream.destroy();
      reject(error);
    });
    fileStream.pipe(uploadStream);
  });

const mostrarResumen = ({ total, migrados, errores, omitidos }) => {
  console.log("================================");
  console.log("MIGRACIÓN FINALIZADA");
  console.log("================================");
  console.log(`Total encontrados: ${total}`);
  console.log(`Migrados correctamente: ${migrados}`);
  console.log(`Con error: ${errores}`);
  console.log(`Omitidos: ${omitidos}`);
  console.log("================================");
};

const main = async () => {
  dotenv.config({ path: path.join(backDirectory, ".env") });

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const variablesRequeridas = [
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "DB_HOST",
    "DB_USER",
    "DB_PASSWORD",
    "DB_NAME",
  ];
  const variablesFaltantes = variablesRequeridas.filter(
    (variable) => !process.env[variable],
  );

  if (variablesFaltantes.length > 0) {
    throw new Error(
      `Faltan variables de entorno requeridas: ${variablesFaltantes.join(", ")}`,
    );
  }

  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT || 3306),
    });

    const movimientoId = process.argv[2];
    const [movimientos] = movimientoId
      ? await connection.query(
          "SELECT id, nombre, media_url AS mediaUrl FROM movimientos WHERE id = ?",
          [movimientoId],
        )
      : await connection.query(
          "SELECT id, nombre, media_url AS mediaUrl FROM movimientos WHERE media_url LIKE '/uploads/movimientos/%'",
        );
    if (movimientoId && movimientos.length === 0) {
      console.log(`No se encontró el movimiento con ID ${movimientoId}.`);
    }
    const resumen = {
      total: movimientos.length,
      migrados: 0,
      errores: 0,
      omitidos: 0,
    };

    for (const [index, movimiento] of movimientos.entries()) {
      const progreso = `[${index + 1}/${resumen.total}]`;

      if (!movimiento.mediaUrl?.startsWith(mediaPrefix)) {
        resumen.omitidos += 1;
        console.log(`${progreso} - Registro omitido: ${movimiento.id}`);
        continue;
      }

      const fileName = path.basename(movimiento.mediaUrl);
      const filePath = path.join(uploadsDirectory, fileName);

      try {
        await access(filePath);
        const resultado = await subirArchivo(filePath);

        if (!resultado?.secure_url || !resultado.public_id) {
          throw new Error("Cloudinary no devolvió secure_url y public_id");
        }

        try {
          await connection.execute(
            "UPDATE movimientos SET media_url = ? WHERE id = ?",
            [resultado.secure_url, movimiento.id],
          );
        } catch (error) {
          try {
            await cloudinary.uploader.destroy(resultado.public_id, {
              resource_type: resultado.resource_type,
            });
          } catch (errorEliminacion) {
            console.error(
              `  No se pudo eliminar el archivo de Cloudinary (${resultado.public_id}):`,
              errorEliminacion,
            );
          }
          throw error;
        }

        resumen.migrados += 1;
        console.log(`${progreso} ✓ ${fileName}`);
      } catch (error) {
        resumen.errores += 1;
        console.log(`${progreso} ✗ ${fileName}`);
        console.error(`  Motivo: ${error.message}`);
      }
    }

    mostrarResumen(resumen);
  } catch (error) {
    console.error("Error al ejecutar la migración:", error);
    process.exitCode = 1;
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (error) {
        console.error("Error al cerrar la conexión a MySQL:", error);
        process.exitCode = 1;
      }
    }
  }
};

main();
