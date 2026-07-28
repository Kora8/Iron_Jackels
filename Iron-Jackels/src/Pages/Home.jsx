import "./Home.css";

import { useNavigate } from "react-router-dom";
import { disciplinas } from "./../data/disciplinas";

import CardDisciplina from "./../components/CardDisciplina";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container py-5">
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
