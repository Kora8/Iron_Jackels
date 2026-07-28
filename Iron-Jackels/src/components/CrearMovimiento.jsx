import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { disciplinas } from "../data/disciplinas";
import { agregarMovimiento } from "../data/movimientos";

import {
  finalidades,
  dificultades,
  modosEntrenamiento,
} from "../data/opcionesFormulario";

import Select from "./Select";

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
    media: "",
    mediaType: "",
    mediaName: "",
  });

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
    const file = e.target.files?.[0];
    if (!file) return;

    const lector = new FileReader();

    lector.onload = () => {
      const resultado = typeof lector.result === "string" ? lector.result : "";

      setFormulario((prev) => ({
        ...prev,
        media: resultado,
        mediaType: file.type,
        mediaName: file.name,
      }));
    };

    lector.onerror = () => {
      setFormulario((prev) => ({
        ...prev,
        media: "",
        mediaType: "",
        mediaName: "",
      }));
    };

    lector.readAsDataURL(file);
  };

  const disciplinaSeleccionada = disciplinas.find(
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
    formulario.media,
  ].every((valor) => Boolean(valor && String(valor).trim()));

  const aceptar = () => {
    if (!formularioCompleto) return;

    const disciplinaSeleccionada = disciplinas.find(
      (disciplina) => disciplina.id === Number(formulario.disciplina),
    );

    agregarMovimiento({
      id: Date.now(),
      nombre: formulario.nombre,
      disciplinaSlug: slug || disciplinaSeleccionada?.slug,
      disciplinaNombre: disciplinaSeleccionada?.nombre || "Disciplina",
      tipo: formulario.tipo,
      finalidad: formulario.finalidad,
      dificultad: formulario.dificultad,
      modo: formulario.modo,
      media: formulario.media,
      mediaType: formulario.mediaType,
      mediaName: formulario.mediaName,
    });

    navigate(`/disciplinas/${slug || disciplinaSeleccionada?.slug}/lista`);
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
        options={disciplinas.map((d) => ({
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
          value: tipo,
          label: tipo,
        }))}
      />

      <Select
        label="Finalidad"
        name="finalidad"
        value={formulario.finalidad}
        onChange={cambiarValor}
        options={finalidades.map((f) => ({
          value: f,
          label: f,
        }))}
      />

      <Select
        label="Dificultad"
        name="dificultad"
        value={formulario.dificultad}
        onChange={cambiarValor}
        options={dificultades.map((d) => ({
          value: d,
          label: d,
        }))}
      />

      <Select
        label="Modo de entrenamiento"
        name="modo"
        value={formulario.modo}
        onChange={cambiarValor}
        options={modosEntrenamiento.map((m) => ({
          value: m,
          label: m,
        }))}
      />

      <div className="d-flex gap-2 mt-4">
        <button
          className="btn btn-success"
          onClick={aceptar}
          disabled={!formularioCompleto}
        >
          Aceptar
        </button>
        <button className="btn btn-outline-light" onClick={cancelar}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default CrearMovimiento;
