import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { eliminarRutina, obtenerRutinas } from "../data/rutinas";

function MisRutinas() {
  const navigate = useNavigate();
  const [rutinas, setRutinas] = useState(() => obtenerRutinas());

  const confirmarEliminacion = (rutina) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar esta rutina? Esta acción no se puede deshacer.",
    );
    if (confirmar) setRutinas(eliminarRutina(rutina.id));
  };

  return (
    <div className="container py-4 text-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Mis rutinas</h2>
          <p className="text-secondary mb-0">Listado de rutinas guardadas</p>
        </div>
        <button className="btn btn-outline-light" onClick={() => navigate("/")}>
          Volver al inicio
        </button>
      </div>

      {rutinas.length === 0 ? (
        <div className="border rounded p-4 text-center text-secondary">
          Aún no has creado ninguna rutina.
        </div>
      ) : (
        <div className="row g-3">
          {rutinas.map((rutina) => (
            <div className="col-12" key={rutina.id}>
              <div
                className="border rounded p-3"
                style={{ background: "#111" }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">{rutina.nombre}</h5>
                    <p className="text-secondary mb-0">
                      Disciplina: {rutina.disciplinaSlug || "Sin disciplina"}
                    </p>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      className="btn btn-outline-light btn-sm"
                      onClick={() => navigate(`/rutinas/${rutina.id}`)}
                    >
                      Ver
                    </button>
                    <button
                      className="btn btn-outline-info btn-sm"
                      onClick={() => navigate(`/rutinas/${rutina.id}/editar`)}
                    >
                      Editar rutina
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => confirmarEliminacion(rutina)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MisRutinas;
