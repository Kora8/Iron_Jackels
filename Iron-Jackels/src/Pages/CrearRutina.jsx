import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  actualizarRutina,
  guardarRutina,
  obtenerRutinas,
} from "../data/rutinas";
import { API_URL } from "../config/api";

const etapas = [
  { key: "calentamiento", label: "Calentamiento" },
  { key: "entrenamiento", label: "Entrenamiento" },
  { key: "acondicionamiento", label: "Acondicionamiento / Enfriamiento" },
];

function CrearRutina() {
  const navigate = useNavigate();
  const { slug, id } = useParams();
  const rutinaExistente = id
    ? obtenerRutinas().find((rutina) => String(rutina.id) === String(id))
    : null;
  const disciplinaSlug = rutinaExistente?.disciplinaSlug || slug;
  const [nombreRutina, setNombreRutina] = useState(
    () => rutinaExistente?.nombre || "",
  );
  const [movimientosDisponibles, setMovimientosDisponibles] = useState([]);
  const [disciplinasDisponibles, setDisciplinasDisponibles] = useState([]);
  const [cargandoMovimientos, setCargandoMovimientos] = useState(true);
  const [errorMovimientos, setErrorMovimientos] = useState("");
  const [seleccionados, setSeleccionados] = useState(() =>
    Array.from(
      new Map(
        Object.values(rutinaExistente?.etapas || {})
          .flat()
          .map((movimiento) => [String(movimiento.id), movimiento]),
      ).values(),
    ),
  );
  const [asignaciones, setAsignaciones] = useState(() => ({
    calentamiento: [],
    entrenamiento: [],
    acondicionamiento: [],
    ...(rutinaExistente?.etapas || {}),
  }));

  useEffect(() => {
    const cargarMovimientos = async () => {
      setCargandoMovimientos(true);
      setErrorMovimientos("");

      try {
        const [movimientosResponse, disciplinasResponse] = await Promise.all([
          fetch(`${API_URL}/movimientos`),
          fetch(`${API_URL}/disciplinas`),
        ]);
        if (!movimientosResponse.ok || !disciplinasResponse.ok) {
          throw new Error("No se pudieron cargar los datos de movimientos");
        }

        const [movimientosData, disciplinasData] = await Promise.all([
          movimientosResponse.json(),
          disciplinasResponse.json(),
        ]);
        if (
          !Array.isArray(movimientosData) ||
          !Array.isArray(disciplinasData)
        ) {
          throw new Error("La respuesta de movimientos no es un array");
        }

        setDisciplinasDisponibles(disciplinasData);
        setMovimientosDisponibles(
          movimientosData.map((movimiento) => {
            const disciplina = disciplinasData.find(
              (item) => item.slug === movimiento.disciplinaSlug,
            );
            return {
              ...movimiento,
              disciplinaNombre:
                disciplina?.nombre ||
                movimiento.disciplinaNombre ||
                "Disciplina",
              disciplinaOrigen:
                movimiento.disciplinaOrigen ||
                disciplina?.nombre ||
                movimiento.disciplinaNombre ||
                "MMA",
              disciplinaColor: disciplina?.color || "#bbbbbb",
            };
          }),
        );
      } catch (error) {
        console.error("Error al cargar movimientos:", error);
        setErrorMovimientos("No se pudieron cargar los movimientos.");
        setMovimientosDisponibles([]);
      } finally {
        setCargandoMovimientos(false);
      }
    };

    cargarMovimientos();
  }, []);

  const slugEjercicioFisico = disciplinasDisponibles.find(
    (disciplina) =>
      disciplina.nombre
        ?.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase() === "ejercicio fisico",
  )?.slug;
  const movimientos = movimientosDisponibles.filter(
    (movimiento) =>
      disciplinaSlug === "mma" ||
      movimiento.disciplinaSlug === disciplinaSlug ||
      movimiento.disciplinaSlug === slugEjercicioFisico,
  );

  const agregarMovimiento = (movimiento) => {
    if (seleccionados.some((item) => item.id === movimiento.id)) return;
    setSeleccionados((prev) => [...prev, movimiento]);
  };

  const moverArriba = (etapaKey, index) => {
    if (index === 0) return;
    setAsignaciones((prev) => {
      const copia = [...prev[etapaKey]];
      const temporal = copia[index];
      copia[index] = copia[index - 1];
      copia[index - 1] = temporal;
      return { ...prev, [etapaKey]: copia };
    });
  };

  const moverAbajo = (etapaKey, index) => {
    setAsignaciones((prev) => {
      const copia = [...prev[etapaKey]];
      if (index >= copia.length - 1) return prev;
      const temporal = copia[index];
      copia[index] = copia[index + 1];
      copia[index + 1] = temporal;
      return { ...prev, [etapaKey]: copia };
    });
  };

  const asignarMovimiento = (etapaKey, movimiento) => {
    setAsignaciones((prev) => ({
      ...prev,
      [etapaKey]: [...prev[etapaKey], movimiento],
    }));
  };

  const quitarMovimiento = (etapaKey, index) => {
    setAsignaciones((prev) => ({
      ...prev,
      [etapaKey]: prev[etapaKey].filter(
        (_, movimientoIndex) => movimientoIndex !== index,
      ),
    }));
  };

  const guardar = () => {
    if (!nombreRutina.trim()) return;

    const artesMarciales = Array.from(
      new Set(
        Object.values(asignaciones)
          .flat()
          .map((movimiento) => movimiento.disciplinaOrigen || "MMA")
          .filter(Boolean),
      ),
    );

    const datosRutina = {
      nombre: nombreRutina,
      disciplinaSlug,
      artesMarciales,
      etapas: asignaciones,
    };

    if (id) {
      actualizarRutina(id, datosRutina);
      navigate(`/rutinas/${id}`);
      return;
    }

    guardarRutina(datosRutina);

    navigate(`/disciplinas/${slug}/lista`);
  };

  if (id && !rutinaExistente) {
    return (
      <div className="container py-4 text-light">
        <h3>No se encontró la rutina</h3>
        <button
          className="btn btn-outline-light mt-3"
          onClick={() => navigate("/mis-rutinas")}
        >
          Volver a Mis rutinas
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4 text-light">
      <h2 className="mb-4">{id ? "Editar rutina" : "Crear rutina"}</h2>

      <div className="mb-4">
        <label className="form-label">Nombre de la rutina</label>
        <input
          type="text"
          className="form-control"
          value={nombreRutina}
          onChange={(e) => setNombreRutina(e.target.value)}
          placeholder="Ej: Rutina de fuerza"
        />
      </div>

      <div className="mb-4">
        <h5>Movimientos disponibles</h5>
        {cargandoMovimientos && <p>Cargando movimientos...</p>}
        {errorMovimientos && <p className="text-danger">{errorMovimientos}</p>}
        {!cargandoMovimientos && !errorMovimientos && (
          <div className="row g-3">
            {movimientos.map((movimiento) => (
              <div className="col-md-4" key={movimiento.id}>
                <div className="border rounded p-3">
                  <strong>{movimiento.nombre}</strong>
                  <div className="my-2">
                    <span
                      className="badge rounded-pill border text-uppercase"
                      style={{
                        color: movimiento.disciplinaColor,
                        borderColor: movimiento.disciplinaColor,
                        backgroundColor: `${movimiento.disciplinaColor}20`,
                      }}
                    >
                      {movimiento.disciplinaNombre}
                    </span>
                  </div>
                  <p className="text-secondary small mb-2">{movimiento.tipo}</p>
                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={() => agregarMovimiento(movimiento)}
                    disabled={seleccionados.some(
                      (item) => String(item.id) === String(movimiento.id),
                    )}
                  >
                    {seleccionados.some(
                      (item) => String(item.id) === String(movimiento.id),
                    )
                      ? "Añadido"
                      : "Añadir"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4">
        <h5>Orden y etapas</h5>
        {etapas.map((etapa) => (
          <div className="border rounded p-3 mb-3" key={etapa.key}>
            <h6>{etapa.label}</h6>
            <div className="d-flex flex-wrap gap-2 mb-2">
              {seleccionados.map((movimiento) => (
                <button
                  key={`${etapa.key}-${movimiento.id}`}
                  className="btn btn-outline-light btn-sm"
                  onClick={() => asignarMovimiento(etapa.key, movimiento)}
                >
                  {movimiento.nombre}
                </button>
              ))}
            </div>
            <div className="mt-3">
              {asignaciones[etapa.key].map((movimiento, index) => (
                <div
                  key={`${etapa.key}-${movimiento.id}-${index}`}
                  className="d-flex align-items-center gap-2 mb-2"
                >
                  <span className="badge bg-secondary">{index + 1}</span>
                  <span>{movimiento.nombre}</span>
                  <span
                    className="badge rounded-pill border text-uppercase"
                    style={{
                      color: movimiento.disciplinaColor || "#bbbbbb",
                      borderColor: movimiento.disciplinaColor || "#bbbbbb",
                      backgroundColor: `${movimiento.disciplinaColor || "#bbbbbb"}20`,
                    }}
                  >
                    {movimiento.disciplinaNombre ||
                      movimiento.disciplinaOrigen ||
                      "Disciplina"}
                  </span>
                  <button
                    className="btn btn-sm btn-outline-light"
                    onClick={() => moverArriba(etapa.key, index)}
                    aria-label={`Mover ${movimiento.nombre} hacia arriba`}
                  >
                    ↑
                  </button>
                  <button
                    className="btn btn-sm btn-outline-light"
                    onClick={() => moverAbajo(etapa.key, index)}
                    aria-label={`Mover ${movimiento.nombre} hacia abajo`}
                  >
                    ↓
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => quitarMovimiento(etapa.key, index)}
                    aria-label={`Quitar ${movimiento.nombre} de ${etapa.label}`}
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex gap-2">
        <button className="btn btn-success" onClick={guardar}>
          {id ? "Guardar cambios" : "Guardar rutina"}
        </button>
        <button className="btn btn-outline-light" onClick={() => navigate(-1)}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default CrearRutina;
