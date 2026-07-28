const STORAGE_KEY = "rutinas-iron-jackels";

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
