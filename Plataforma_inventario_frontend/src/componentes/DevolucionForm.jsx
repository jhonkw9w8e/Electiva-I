import React, { useState, useEffect } from "react";
import axios from "axios";

export default function DevolucionForm() {
  const [productos, setProductos] = useState([]);
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [motivo, setMotivo] = useState("");
  const [lista, setLista] = useState([]);
  const [error, setError] = useState("");

  const BASE_DEV = "http://127.0.0.1:8000/api/devoluciones/";
  const BASE_PROD = "http://127.0.0.1:8000/api/productos/";

  const cargarDevoluciones = async () => {
    try {
      const res = await axios.get(BASE_DEV);
      const data = res.data;
      setLista(Array.isArray(data) ? data : data.results || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.status === 404
          ? "Endpoint de devoluciones no encontrado (404)."
          : "No se pudo cargar devoluciones."
      );
      setLista([]);
    }
  };

  const cargarProductos = async () => {
    try {
      const res = await axios.get(BASE_PROD);
      setProductos(res.data);
    } catch (err) {
      console.error("Error cargando productos:", err);
    }
  };

  useEffect(() => {
    cargarDevoluciones();
    cargarProductos();
  }, []);

  const guardar = async () => {
    setError("");
    if (!productoId) {
      setError("Selecciona un producto.");
      return;
    }
    try {
      await axios.post(BASE_DEV, {
        producto: Number(productoId),
        cantidad,
        motivo,
        reincorpora: true,
      });
      alert("Devolución registrada exitosamente.");
      // Reset campos
      setProductoId("");
      setCantidad(1);
      setMotivo("");
      // Recargar lista
      cargarDevoluciones();
    } catch (err) {
      console.error("Error guardando devolución:", err);
      if (err.response?.status === 400 && err.response.data) {
        const msgs = Object.entries(err.response.data)
          .map(
            ([f, m]) => `${f}: ${Array.isArray(m) ? m.join(", ") : String(m)}`
          )
          .join("\n");
        setError(msgs);
      } else {
        setError("No se pudo registrar la devolución.");
      }
    }
  };

  return (
    <div className="p-4 bg-green-50 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Formulario de Devolución</h2>

      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-sm font-medium">Producto devuelto</label>
          <select
            value={productoId}
            onChange={(e) => setProductoId(e.target.value)}
            className="mt-1 block w-full border rounded p-2 bg-white"
          >
            <option value="">-- Selecciona un producto --</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Cantidad</label>
          <input
            type="number"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Motivo</label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        <button
          onClick={guardar}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Guardar Devolución
        </button>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 whitespace-pre-wrap rounded">
          {error}
        </div>
      )}

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Producto</th>
            <th className="px-4 py-2 border">Cantidad</th>
            <th className="px-4 py-2 border">Motivo</th>
            <th className="px-4 py-2 border">Fecha</th>
            <th className="px-4 py-2 border">Usuario</th>
          </tr>
        </thead>
        <tbody>
          {lista.length > 0 ? (
            lista.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-2 border">{item.producto_nombre}</td>
                <td className="px-4 py-2 border">{item.cantidad}</td>
                <td className="px-4 py-2 border">{item.motivo}</td>
                <td className="px-4 py-2 border">{item.fecha}</td>
                <td className="px-4 py-2 border">{item.usuario}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No hay devoluciones para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
