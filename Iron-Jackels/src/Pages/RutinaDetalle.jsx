import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { disciplinas } from "../data/disciplinas";
import { obtenerRutinas } from "../data/rutinas";

function RutinaDetalle() {
  const navigate = useNavigate();
  const { id } = useParams();

  const tieneMediaValida = (media) =>
    typeof media === "string" &&
    media.trim() !== "" &&
    !media.startsWith("blob:");

  const rutina = useMemo(() => {
    const rutinas = obtenerRutinas();
    return rutinas.find((item) => String(item.id) === String(id)) || null;
  }, [id]);

  const disciplina = useMemo(
    () => disciplinas.find((item) => item.slug === rutina?.disciplinaSlug),
    [rutina?.disciplinaSlug],
  );

  if (!rutina) {
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
      <button
        className="btn btn-outline-light mb-4"
        onClick={() => navigate("/mis-rutinas")}
      >
        Volver
      </button>

      <h2>{rutina.nombre}</h2>
      <p className="text-secondary">
        Disciplina: {rutina.disciplinaSlug || "Sin disciplina"}
      </p>
      {rutina.artesMarciales?.length > 0 && (
        <div className="mb-4">
          <h5>Artes marciales usadas</h5>
          <div className="d-flex flex-wrap gap-2">
            {rutina.artesMarciales.map((arte) => (
              <span key={arte} className="badge bg-light text-dark">
                {arte}
              </span>
            ))}
          </div>
        </div>
      )}

      {Object.entries(rutina.etapas || {}).map(([key, items]) => (
        <div
          key={key}
          className="mt-4 p-3"
          style={{ background: "transparent" }}
        >
          <h5 className="text-uppercase text-secondary">{key}</h5>
          <div className="row g-3 mt-3">
            {items.map((item, index) => (
              <div className="col-md-4 col-sm-6" key={`${key}-${index}`}>
                <div
                  className="rounded overflow-hidden h-100"
                  style={{
                    border: `2px solid ${disciplina?.color || "#ffffff"}`,
                    background: "#1a1a1a",
                  }}
                >
                  {tieneMediaValida(item.media) &&
                  item.mediaType?.startsWith("video") ? (
                    <video
                      className="w-100"
                      style={{ maxHeight: 220, objectFit: "cover" }}
                      controls
                      src={item.media}
                    />
                  ) : tieneMediaValida(item.media) &&
                    item.mediaType?.startsWith("image") ? (
                    <img
                      className="w-100"
                      style={{ maxHeight: 220, objectFit: "cover" }}
                      src={item.media}
                      alt={item.nombre}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{ height: 220, background: "#222" }}
                    >
                      <span className="text-secondary">Sin media</span>
                    </div>
                  )}

                  <div className="p-3">
                    <h6 className="mb-1">{item.nombre}</h6>
                    <p className="text-secondary mb-0 small">
                      {item.tipo || "Movimiento"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default RutinaDetalle;
