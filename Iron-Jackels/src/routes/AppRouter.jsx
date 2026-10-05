import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import CrearMovimiento from "../components/CrearMovimiento";
import ListaMovimientos from "../Pages/ListaMovimientos";
import CrearRutina from "../Pages/CrearRutina";
import MisRutinas from "../Pages/MisRutinas";
import RutinaDetalle from "../Pages/RutinaDetalle";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/disciplinas/:slug/movimientos"
        element={<CrearMovimiento />}
      />

      <Route path="/disciplinas/:slug/lista" element={<ListaMovimientos />} />
      <Route path="/disciplinas/:slug/rutinas" element={<CrearRutina />} />
      <Route path="/mis-rutinas" element={<MisRutinas />} />
      <Route path="/rutinas/:id/editar" element={<CrearRutina />} />
      <Route path="/rutinas/:id" element={<RutinaDetalle />} />
    </Routes>
  );
}

export default AppRouter;
