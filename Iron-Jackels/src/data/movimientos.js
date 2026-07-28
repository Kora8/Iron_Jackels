const STORAGE_KEY = "movimientos-iron-jackels";

const leerMovimientos = () => {
  if (typeof window === "undefined") return [];

  try {
    const guardados = localStorage.getItem(STORAGE_KEY);
    return guardados ? JSON.parse(guardados) : [];
  } catch {
    return [];
  }
};

const guardarMovimientos = (movimientos) => {
  if (typeof window === "undefined") return;

  const datos = movimientos.map((movimiento) => ({
    ...movimiento,
    media: typeof movimiento.media === "string" ? movimiento.media : "",
    mediaType: movimiento.mediaType || "",
    mediaName: movimiento.mediaName || "",
  }));

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
  } catch {
    const sinMedia = datos.map((movimiento) => ({
      ...movimiento,
      media: "",
      mediaType: movimiento.mediaType || "",
      mediaName: movimiento.mediaName || "",
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sinMedia));
  }
};

export const obtenerMovimientos = (disciplinaSlug) => {
  const movimientos = leerMovimientos();
  return movimientos.filter(
    (movimiento) => movimiento.disciplinaSlug === disciplinaSlug,
  );
};

export const agregarMovimiento = (movimiento) => {
  const movimientos = leerMovimientos();
  const nuevos = [...movimientos, movimiento];
  guardarMovimientos(nuevos);
  return nuevos;
};
