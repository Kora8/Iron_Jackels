import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { disciplinas } from "../data/disciplinas";
import { obtenerMovimientos } from "../data/movimientos";

function ListaMovimientos() {
  const navigate = useNavigate();
  const { slug } = useParams();

  const tieneMediaValida = (media) =>
    typeof media === "string" &&
    media.trim() !== "" &&
    !media.startsWith("blob:");

  const disciplina = useMemo(
    () => disciplinas.find((item) => item.slug === slug),
    [slug],
  );

  const movimientos = useMemo(() => obtenerMovimientos(slug), [slug]);

  return (
    <div className="container py-4 text-light">
      <div className="d-flex align-items-center gap-3 mb-4">
        <img
          src={disciplina?.imagen}
          alt={disciplina?.nombre}
          width="70"
          height="70"
        />
        <div>
          <h2 className="mb-1">{disciplina?.nombre || "Disciplina"}</h2>
          <p className="mb-0 text-secondary">
            Movimientos creados por el usuario
          </p>
        </div>
      </div>

      <div className="row g-4">
        {movimientos.length === 0 ? (
          <div className="col-12">
            <div className="border rounded p-4 text-center text-secondary">
              Aún no hay movimientos para esta disciplina.
            </div>
          </div>
        ) : (
          movimientos.map((movimiento) => (
            <div className="col-md-4 col-sm-6" key={movimiento.id}>
              <div
                className="card h-100 border-0"
                style={{ background: "#111", color: "#fff" }}
              >
                {tieneMediaValida(movimiento.media) &&
                movimiento.mediaType?.startsWith("video") ? (
                  <video
                    className="card-img-top"
                    controls
                    src={movimiento.media}
                  />
                ) : tieneMediaValida(movimiento.media) &&
                  movimiento.mediaType?.startsWith("image") ? (
                  <img
                    className="card-img-top"
                    src={movimiento.media}
                    alt={movimiento.nombre}
                  />
                ) : (
                  <div
                    className="card-img-top d-flex align-items-center justify-content-center text-secondary"
                    style={{ minHeight: 180, background: "#1f1f1f" }}
                  >
                    Sin media
                  </div>
                )}

                <div className="card-body">
                  <h5 className="card-title">{movimiento.nombre}</h5>
                  <p className="card-text text-secondary mb-0">
                    {movimiento.tipo} · {movimiento.dificultad}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="d-flex gap-2 mt-4">
        <button
          className="btn btn-outline-light"
          onClick={() => navigate(`/disciplinas/${slug}/movimientos`)}
        >
          Crear movimiento
        </button>
        <button
          className="btn btn-outline-light"
          onClick={() => navigate(`/disciplinas/${slug}/rutinas`)}
        >
          Crear rutina
        </button>
      </div>
    </div>
  );
}

export default ListaMovimientos;
