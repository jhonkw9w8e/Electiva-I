import React, { useState } from "react";
import axios from "axios";

export default function ReporteInventario() {
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [lista, setLista] = useState([]);
  const [formato, setFormato] = useState("pdf");

  const filtrar = async () => {
    try {
      const res = await axios.get("/api/productos/busqueda/", {
        params: { nombre, codigo, categoria, cantidad, precio },
      });
      setLista(Array.isArray(res.data) ? res.data : []);
      alert("Producto Filtrado correctamente");
    } catch (err) {
      console.error("Error en búsqueda:", err);
      setLista([]);
    }
  };

  const exportar = async () => {
    try {
      const res = await axios.get(`/api/reportes/${formato}/`, {
        params: { nombre, codigo, categoria, cantidad, precio },
      });
      alert(res.data.message ?? "Reporte exportado correctamente");
    } catch (err) {
      console.error("Error exportando reporte:", err);
      alert("No se pudo exportar el reporte");
    }
  };

  return (
    <div className="p-6 bg-green-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">
        Formulario de Reporte de Inventario
      </h2>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block font-medium">Nombre Producto</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Código</label>
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className="mt-1 w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Categoría</label>
          <input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="mt-1 w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Cantidad</label>
          <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className="mt-1 w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Precio</label>
          <input
            type="number"
            step="0.01"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="mt-1 w-full border rounded p-2"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={filtrar}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded"
          >
            Filtrar
          </button>
        </div>
      </div>

      <table className="min-w-full mb-6 border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Nombre Producto</th>
            <th className="px-4 py-2">Código</th>
            <th className="px-4 py-2">Categoría</th>
            <th className="px-4 py-2 text-right">Cantidad</th>
            <th className="px-4 py-2 text-right">Precio</th>
          </tr>
        </thead>
        <tbody>
          {lista.length > 0 ? (
            lista.map((p) => (
              <tr key={p.id} className="odd:bg-white even:bg-gray-50">
                <td className="px-4 py-2">{p.nombre}</td>
                <td className="px-4 py-2">{p.codigo}</td>
                <td className="px-4 py-2">{p.categoria}</td>
                <td className="px-4 py-2 text-right">{p.cantidad}</td>
                <td className="px-4 py-2 text-right">
                  {Number(p.precio).toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-4 py-2 text-center text-gray-500">
                No hay productos que coincidan.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex space-x-4">
        <select
          className="border rounded p-2"
          value={formato}
          onChange={(e) => setFormato(e.target.value)}
        >
          <option value="pdf">PDF</option>
          <option value="excel">Excel</option>
        </select>
        <button
          onClick={exportar}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded"
        >
          Confirmar y Descargar
        </button>
      </div>
    </div>
  );
}
