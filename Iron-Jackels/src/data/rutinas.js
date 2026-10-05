const STORAGE_KEY = "rutinas-iron-jackels";
const ESTRUCTURA_STORAGE_PREFIX = "rutina-estructura-";

const leerRutinas = () => {
  if (typeof window === "undefined") return [];

  try {
    const guardadas = localStorage.getItem(STORAGE_KEY);
    return guardadas ? JSON.parse(guardadas) : [];
  } catch {
    return [];
  }
};

const guardarRutinas = (rutinas) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rutinas));
};

export const obtenerRutinas = () => leerRutinas();

export const guardarRutina = (rutina) => {
  const rutinas = leerRutinas();
  const nuevasRutinas = [...rutinas, { id: Date.now(), ...rutina }];
  guardarRutinas(nuevasRutinas);
  return nuevasRutinas;
};

export const actualizarRutina = (id, cambios) => {
  const rutinas = leerRutinas();
  const nuevasRutinas = rutinas.map((rutina) =>
    String(rutina.id) === String(id)
      ? { ...rutina, ...cambios, id: rutina.id }
      : rutina,
  );
  guardarRutinas(nuevasRutinas);
  return nuevasRutinas;
};

export const eliminarRutina = (id) => {
  const rutinas = leerRutinas();
  const nuevasRutinas = rutinas.filter(
    (rutina) => String(rutina.id) !== String(id),
  );

  if (nuevasRutinas.length !== rutinas.length) {
    guardarRutinas(nuevasRutinas);
    if (typeof window !== "undefined") {
      localStorage.removeItem(`${ESTRUCTURA_STORAGE_PREFIX}${id}`);
    }
  }

  return nuevasRutinas;
};
