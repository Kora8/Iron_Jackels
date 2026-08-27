import "./Style_Componentes/CardDisciplina.css";
import { useNavigate } from "react-router-dom";
import { acciones } from "../data/acciones";

function CardDisciplina({ disciplina }) {
  const navigate = useNavigate();

  const irA = (accion) => {
    const ruta = accion === "lista" ? "lista" : accion;
    navigate(`/disciplinas/${disciplina.slug}/${ruta}`);
  };

  return (
    <div
      className="card card-disciplina"
      style={{ borderColor: disciplina.color }}
    >
      <div className="card-body text-center">
        <img
          src={disciplina.imagenUrl}
          className="logo"
          alt={disciplina.nombre}
        />

        <h5 className="text-white mt-3">{disciplina.nombre}</h5>

        <p className="categoria" style={{ color: disciplina.color }}>
          {disciplina.categoria}
        </p>

        {acciones.map((accion) => (
          <button
            key={accion.id}
            className="btn btn-outline-light btn-sm w-100 mt-2"
            onClick={() => irA(accion.id)}
          >
            <i className={`${accion.icono} me-2`}></i>
            {accion.texto}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CardDisciplina;
