import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { eliminarRutina, obtenerRutinas } from "../data/rutinas";
import "./RutinaDetalle.css";
import { SERVER_URL } from "../config/api";
const ESTRUCTURA_STORAGE_PREFIX = "rutina-estructura-";

const obtenerEstructuraGuardada = (rutinaId) => {
  if (typeof window === "undefined") return "";

  return localStorage.getItem(`${ESTRUCTURA_STORAGE_PREFIX}${rutinaId}`) || "";
};

const guardarEstructura = (rutinaId, estructura) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(`${ESTRUCTURA_STORAGE_PREFIX}${rutinaId}`, estructura);
};

const obtenerMediaUrl = (mediaUrl) => {
  if (
    typeof mediaUrl !== "string" ||
    mediaUrl.trim() === "" ||
    mediaUrl.startsWith("blob:")
  ) {
    return null;
  }

  if (mediaUrl.startsWith("http://") || mediaUrl.startsWith("https://")) {
    return mediaUrl;
  }

  return `${SERVER_URL}${mediaUrl.startsWith("/") ? "" : "/"}${mediaUrl}`;
};

const obtenerTipoMedia = (mediaUrl) => {
  if (typeof mediaUrl !== "string") return null;

  const extension = mediaUrl.split("?")[0].split(".").pop()?.toLowerCase();
  const extensionesVideo = ["mp4", "webm"];
  const extensionesImagen = ["jpg", "jpeg", "png", "gif", "webp"];

  if (extensionesVideo.includes(extension)) return "video";
  if (extensionesImagen.includes(extension)) return "image";
  return null;
};

function RutinaDetalle() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [estructuraSesion, setEstructuraSesion] = useState(() =>
    obtenerEstructuraGuardada(id),
  );

  useEffect(() => {
    setEstructuraSesion(obtenerEstructuraGuardada(id));
  }, [id]);

  const tieneMediaValida = (mediaUrl) =>
    typeof mediaUrl === "string" &&
    mediaUrl.trim() !== "" &&
    !mediaUrl.startsWith("blob:");

  const rutina = useMemo(() => {
    const rutinas = obtenerRutinas();
    return rutinas.find((item) => String(item.id) === String(id)) || null;
  }, [id]);

  const confirmarEliminacion = () => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar esta rutina? Esta acción no se puede deshacer.",
    );
    if (!confirmar) return;
    eliminarRutina(id);
    navigate("/mis-rutinas");
  };

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
      <div className="d-flex flex-wrap gap-2 mb-4">
        <button
          className="btn btn-outline-light"
          onClick={() => navigate("/mis-rutinas")}
        >
          Volver
        </button>
        <button
          className="btn btn-outline-info"
          onClick={() => navigate(`/rutinas/${id}/editar`)}
        >
          Editar rutina
        </button>
        <button
          className="btn btn-outline-danger"
          onClick={confirmarEliminacion}
        >
          Eliminar rutina
        </button>
      </div>

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

      <div className="rutina-detalle-layout">
        <section className="rutina-detalle-movimientos">
          {Object.entries(rutina.etapas || {}).map(([key, items]) => (
            <div key={key} className="mt-4 p-3 rutina-detalle-etapa">
              <h5 className="text-uppercase text-secondary">{key}</h5>
              <div className="row g-3 mt-3">
                {items.map((item, index) => {
                  const urlCompleta = obtenerMediaUrl(item.mediaUrl);
                  const tipoMedia = obtenerTipoMedia(item.mediaUrl);

                  return (
                    <div className="col-md-4 col-sm-6" key={`${key}-${index}`}>
                      <div className="rutina-detalle-media-card">
                        {tieneMediaValida(item.mediaUrl) &&
                        tipoMedia === "video" ? (
                          <video
                            className="w-100 rutina-detalle-media"
                            controls
                            src={urlCompleta}
                          />
                        ) : tieneMediaValida(item.mediaUrl) &&
                          tipoMedia === "image" ? (
                          <img
                            className="w-100 rutina-detalle-media"
                            src={urlCompleta}
                            alt={item.nombre}
                          />
                        ) : (
                          <div className="rutina-detalle-media rutina-detalle-sin-media">
                            <span className="text-secondary">Sin media</span>
                          </div>
                        )}

                        <div className="p-3">
                          <h6 className="mb-1">{item.nombre}</h6>
                          <span
                            className="badge rounded-pill border text-uppercase mb-2"
                            style={{
                              color: item.disciplinaColor || "#bbbbbb",
                              borderColor: item.disciplinaColor || "#bbbbbb",
                              backgroundColor: `${item.disciplinaColor || "#bbbbbb"}20`,
                            }}
                          >
                            {item.disciplinaNombre ||
                              item.disciplinaOrigen ||
                              "Disciplina"}
                          </span>
                          <p className="text-secondary mb-0 small">
                            {item.tipo || "Movimiento"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        <aside className="rutina-detalle-estructura">
          <h5 className="rutina-detalle-estructura-titulo">
            Estructura de la sesión
          </h5>
          <textarea
            className="rutina-detalle-textarea"
            value={estructuraSesion}
            onChange={(event) => {
              const nuevaEstructura = event.target.value;
              setEstructuraSesion(nuevaEstructura);
              guardarEstructura(id, nuevaEstructura);
            }}
            placeholder={`Calentamiento y estiramientos
  13 minutos (cuello, hombros, codos, muñecas, cadera, rodillas, tobillos)

Entrenamiento
  Movimiento de pies (3 rounds)
  Sombra (3 rounds)`}
            aria-label="Estructura de la sesión"
          />
        </aside>
      </div>
    </div>
  );
}

export default RutinaDetalle;
