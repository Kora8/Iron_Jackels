import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { disciplinas } from "../data/disciplinas";
import { obtenerMovimientos } from "../data/movimientos";
import { guardarRutina } from "../data/rutinas";

const etapas = [
  { key: "calentamiento", label: "Calentamiento" },
  { key: "entrenamiento", label: "Entrenamiento" },
  { key: "acondicionamiento", label: "Acondicionamiento / Enfriamiento" },
];

function CrearRutina() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [nombreRutina, setNombreRutina] = useState("");
  const [seleccionados, setSeleccionados] = useState([]);
  const [asignaciones, setAsignaciones] = useState({
    calentamiento: [],
    entrenamiento: [],
    acondicionamiento: [],
  });

  const movimientos = useMemo(() => {
    const base = obtenerMovimientos(slug);

    if (slug === "mma") {
      return [
        ...base,
        ...disciplinas
          .filter((disciplina) => disciplina.slug !== "mma")
          .flatMap((disciplina) =>
            obtenerMovimientos(disciplina.slug).map((movimiento) => ({
              ...movimiento,
              disciplinaOrigen: disciplina.nombre,
            })),
          ),
      ];
    }

    return base;
  }, [slug]);

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

    guardarRutina({
      nombre: nombreRutina,
      disciplinaSlug: slug,
      artesMarciales,
      etapas: asignaciones,
    });

    navigate(`/disciplinas/${slug}/lista`);
  };

  return (
    <div className="container py-4 text-light">
      <h2 className="mb-4">Crear rutina</h2>

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
        <div className="row g-3">
          {movimientos.map((movimiento) => (
            <div className="col-md-4" key={movimiento.id}>
              <div className="border rounded p-3">
                <strong>{movimiento.nombre}</strong>
                <p className="text-secondary small mb-2">{movimiento.tipo}</p>
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={() => agregarMovimiento(movimiento)}
                >
                  Añadir
                </button>
              </div>
            </div>
          ))}
        </div>
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
                  <button
                    className="btn btn-sm btn-outline-light"
                    onClick={() => moverArriba(etapa.key, index)}
                  >
                    ↑
                  </button>
                  <button
                    className="btn btn-sm btn-outline-light"
                    onClick={() => moverAbajo(etapa.key, index)}
                  >
                    ↓
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex gap-2">
        <button className="btn btn-success" onClick={guardar}>
          Guardar rutina
        </button>
        <button className="btn btn-outline-light" onClick={() => navigate(-1)}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default CrearRutina;
