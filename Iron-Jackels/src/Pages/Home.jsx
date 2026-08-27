import "./Home.css";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import CardDisciplina from "./../components/CardDisciplina";

function Home() {
  const navigate = useNavigate();
  const [disciplinas, setDisciplinas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerDisciplinas = async () => {
      try {
        setCargando(true);
        const response = await fetch("http://localhost:3000/api/disciplinas");

        if (!response.ok) {
          throw new Error(
            `Error ${response.status}: No se pudo conectar con la API`,
          );
        }

        const datos = await response.json();
        setDisciplinas(datos);
        setError(null);
      } catch (err) {
        console.error("Error al obtener disciplinas:", err);
        setError(err.message);
        setDisciplinas([]);
      } finally {
        setCargando(false);
      }
    };

    obtenerDisciplinas();
  }, []);

  return (
    <div className="container py-5">
      {error && (
        <div className="alert alert-warning" role="alert">
          ⚠️ Error al cargar disciplinas: {error}
        </div>
      )}

      <div className="row g-4">
        {disciplinas.map((disciplina) => (
          <div className="col-lg-3 col-md-4 col-sm-6" key={disciplina.id}>
            <CardDisciplina disciplina={disciplina} />
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center mt-4">
        <button
          className="btn btn-outline-light"
          onClick={() => navigate("/mis-rutinas")}
        >
          Mis rutinas
        </button>
      </div>
    </div>
  );
}

export default Home;
