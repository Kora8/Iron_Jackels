import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:3000/api";

function ListaMovimientos() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [disciplinas, setDisciplinas] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/disciplinas`).then((response) => response.json()),
      fetch(`${API_URL}/movimientos`).then((response) => response.json()),
    ])
      .then(([disciplinasApi, movimientosApi]) => {
        setDisciplinas(disciplinasApi);
        setMovimientos(
          movimientosApi.filter(
            (movimiento) => movimiento.disciplinaSlug === slug,
          ),
        );
      })
      .catch(() => setError("No se pudieron cargar los movimientos"));
  }, [slug]);

  const tieneMediaValida = (media) =>
    typeof media === "string" &&
    media.trim() !== "" &&
    !media.startsWith("blob:");

  const disciplina = disciplinas.find((item) => item.slug === slug);

  const mediaUrl = (media) =>
    media?.startsWith("http") ? media : `http://localhost:3000${media}`;

  return (
    <div className="container py-4 text-light">
      <div className="d-flex align-items-center gap-3 mb-4">
        <img
          src={disciplina?.imagenUrl}
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

      {error && <div className="alert alert-danger">{error}</div>}
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
                {tieneMediaValida(movimiento.mediaUrl) &&
                /\.(mp4|webm)$/i.test(movimiento.mediaUrl) ? (
                  <video
                    className="card-img-top"
                    controls
                    src={mediaUrl(movimiento.mediaUrl)}
                  />
                ) : tieneMediaValida(movimiento.mediaUrl) ? (
                  <img
                    className="card-img-top"
                    src={mediaUrl(movimiento.mediaUrl)}
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
