import React from "react";
import axios from "axios";

axios.defaults.headers.common["Authorization"] =
  "Token b170e172e11061acd630115c928dd0fab9ecb0f1 ";

import { Route, Routes } from "react-router-dom";
import ProductForm from "./componentes/ProductForm";
import Home from "./componentes/Home";
import StockUpdateForm from "./componentes/StockUpdateForm";
import NotificacionesPanel from "./componentes/NotificacionesPanel";
import RegisterForm from "./componentes/RegisterUsuarioForm";
import MovimientosTable from "./componentes/MovimientosTable";
import ProductSearch from "./componentes/ProductSearch";
import ReporteInventario from "./componentes/ReporteInventario";
import DevolucionForm from "./componentes/DevolucionForm";
import AssignEditorRole from "./componentes/RolesEditor";
import UserManagement from "./componentes/UserManagement";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product-form" element={<ProductForm />} />
      <Route path="/stock-update" element={<StockUpdateForm />} />
      <Route path="/notificaciones" element={<NotificacionesPanel />} />
      <Route path="/register-user" element={<RegisterForm />} />
      <Route path="/movimientos" element={<MovimientosTable />} />
      <Route path="/product-search" element={<ProductSearch />} />
      <Route path="/report-inventory" element={<ReporteInventario />} />
      <Route path="/devolucion-form" element={<DevolucionForm />} />
      <Route path="/roles-editor" element={<AssignEditorRole />} />
      <Route path="/user-managment" element={<UserManagement />} />
    </Routes>
  );
}
