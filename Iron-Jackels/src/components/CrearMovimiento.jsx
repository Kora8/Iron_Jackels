import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Select from "./Select";
import { API_URL } from "../config/api";

function CrearMovimiento() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [formulario, setFormulario] = useState({
    nombre: "",
    disciplina: "",
    tipo: "",
    finalidad: "",
    dificultad: "",
    modo: "",
    archivo: null,
  });
  const [opciones, setOpciones] = useState({
    disciplinas: [],
    finalidades: [],
    dificultades: [],
    modosEntrenamiento: [],
  });
  const [vistaPrevia, setVistaPrevia] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/disciplinas/opciones-movimiento`)
      .then((response) => {
        if (!response.ok) throw new Error("No se pudieron cargar las opciones");
        return response.json();
      })
      .then(setOpciones)
      .catch((err) => setError(err.message));
  }, []);

  const cambiarValor = (e) => {
    const { name, value } = e.target;

    setFormulario((prev) => ({
      ...prev,
      [name]: value,

      ...(name === "disciplina" && {
        tipo: "",
      }),
    }));
  };

  const cambiarArchivo = (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    setFormulario((prev) => ({ ...prev, archivo }));
    setVistaPrevia(URL.createObjectURL(archivo));
  };

  const disciplinaSeleccionada = opciones.disciplinas.find(
    (d) => d.id === Number(formulario.disciplina),
  );

  const tiposMovimiento = disciplinaSeleccionada?.tiposMovimiento ?? [];

  const formularioCompleto = [
    formulario.nombre,
    formulario.disciplina,
    formulario.tipo,
    formulario.finalidad,
    formulario.dificultad,
    formulario.modo,
    formulario.archivo,
  ].every((valor) => Boolean(valor && String(valor).trim()));

  const aceptar = async () => {
    if (!formularioCompleto) return;
    setGuardando(true);
    setError("");
    const formData = new FormData();
    formData.append("nombre", formulario.nombre);
    formData.append("disciplina_id", formulario.disciplina);
    formData.append("tipo_movimiento_id", formulario.tipo);
    formData.append("finalidad_id", formulario.finalidad);
    formData.append("dificultad_id", formulario.dificultad);
    formData.append("modo_entrenamiento_id", formulario.modo);
    formData.append("media", formulario.archivo);

    try {
      const response = await fetch(`${API_URL}/movimientos`, {
        method: "POST",
        body: formData,
      });
      const datos = await response.json();
      if (!response.ok)
        throw new Error(datos.mensaje || "No se pudo guardar el movimiento");
      navigate(`/disciplinas/${slug || disciplinaSeleccionada?.slug}/lista`);
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const cancelar = () => {
    navigate(-1);
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <label className="form-label text-light">Nombre del movimiento</label>
        <input
          type="text"
          className="form-control"
          name="nombre"
          value={formulario.nombre}
          onChange={cambiarValor}
          placeholder="Ej: Kimura"
        />
      </div>

      <div className="mb-4">
        <label className="form-label text-light">Video, GIF o imagen</label>
        <input
          type="file"
          className="form-control"
          accept="image/*,video/*,image/gif"
          onChange={cambiarArchivo}
        />
      </div>

      <Select
        label="Arte marcial"
        name="disciplina"
        value={formulario.disciplina}
        onChange={cambiarValor}
        options={opciones.disciplinas.map((d) => ({
          value: d.id,
          label: d.nombre,
        }))}
      />

      <Select
        label="Tipo de movimiento"
        name="tipo"
        value={formulario.tipo}
        onChange={cambiarValor}
        options={tiposMovimiento.map((tipo) => ({
          value: tipo.id,
          label: tipo.nombre,
        }))}
      />

      <Select
        label="Finalidad"
        name="finalidad"
        value={formulario.finalidad}
        onChange={cambiarValor}
        options={opciones.finalidades.map((f) => ({
          value: f.id,
          label: f.nombre,
        }))}
      />

      <Select
        label="Dificultad"
        name="dificultad"
        value={formulario.dificultad}
        onChange={cambiarValor}
        options={opciones.dificultades.map((d) => ({
          value: d.id,
          label: d.nombre,
        }))}
      />

      <Select
        label="Modo de entrenamiento"
        name="modo"
        value={formulario.modo}
        onChange={cambiarValor}
        options={opciones.modosEntrenamiento.map((m) => ({
          value: m.id,
          label: m.nombre,
        }))}
      />

      <div className="d-flex gap-2 mt-4">
        {error && <div className="alert alert-danger w-100 mb-0">{error}</div>}
        <button
          className="btn btn-success"
          onClick={aceptar}
          disabled={!formularioCompleto || guardando}
        >
          Aceptar
        </button>
        <button className="btn btn-outline-light" onClick={cancelar}>
          Cancelar
        </button>
      </div>
      {vistaPrevia && formulario.archivo?.type.startsWith("image/") && (
        <img
          className="img-fluid mt-3"
          src={vistaPrevia}
          alt="Vista previa"
          style={{ maxHeight: 240 }}
        />
      )}
      {vistaPrevia && formulario.archivo?.type.startsWith("video/") && (
        <video
          className="img-fluid mt-3"
          src={vistaPrevia}
          controls
          style={{ maxHeight: 240 }}
        />
      )}
    </div>
  );
}

export default CrearMovimiento;
