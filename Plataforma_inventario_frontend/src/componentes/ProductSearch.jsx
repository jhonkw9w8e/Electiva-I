import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const ProductSearch = () => {
  const [filtros, setFiltros] = useState({
    nombre: "",
    codigo: "",
    categoria: "",
  });
  const [productos, setProductos] = useState([]);

  const fetchProductos = useCallback(async () => {
    try {
      const qs = new URLSearchParams(filtros).toString();
      const { data } = await axios.get(
        `http://127.0.0.1:8000/api/productos/busqueda/?${qs}`
      );
      setProductos(data);
    } catch (err) {
      console.error("Error al buscar productos:", err);
    }
  }, [filtros]);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  const handleChange = ({ target: { name, value } }) => {
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-5xl mx-auto bg-[#E5E5E5] border border-gray-400 rounded-lg shadow-sm">
        <div className="h-6 bg-gray-300 flex items-center px-2 space-x-2 rounded-t-lg">
          <span className="w-3 h-3 bg-[#ff5f56] rounded-full" />
          <span className="w-3 h-3 bg-[#ffbd2e] rounded-full" />
          <span className="w-3 h-3 bg-[#27c93f] rounded-full" />
        </div>

        <h2 className="text-center text-xl font-bold text-[#0056B3] mt-4 uppercase">
          Filtrado de Productos
        </h2>
        <hr className="border-gray-500 my-4" />

        <div className="px-6 pb-6">
          <div className="bg-white border border-gray-300 rounded-md p-4 mb-6">
            <h3 className="font-bold mb-4">Filtros</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block mb-1">Nombre</label>
                <input
                  name="nombre"
                  value={filtros.nombre}
                  onChange={handleChange}
                  placeholder="Ingresa nombre"
                  className="w-full border border-gray-400 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1">Código</label>
                <input
                  name="codigo"
                  value={filtros.codigo}
                  onChange={handleChange}
                  placeholder="Ingresa código"
                  className="w-full border border-gray-400 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1">Categoría</label>
                <select
                  name="categoria"
                  value={filtros.categoria}
                  onChange={handleChange}
                  className="w-full border border-gray-400 rounded px-3 py-2"
                >
                  <option value="">Todas las Categorías</option>
                  <option value="Materias Primas">Materias Primas</option>
                  <option value="Productos Terminados">
                    Productos Terminados
                  </option>
                  <option value="Herramientas y Equipos">
                    Herramientas y Equipos
                  </option>
                  <option value="Consumibles">Consumibles</option>
                  <option value="Repuestos">Repuestos</option>
                  <option value="Productos Perecederos">
                    Productos Perecederos
                  </option>
                  <option value="Productos No Perecederos">
                    Productos No Perecederos
                  </option>
                </select>
              </div>
              <button
                type="button"
                onClick={fetchProductos}
                className="bg-[#0056B3] text-white font-bold px-4 py-2 rounded hover:bg-blue-600"
              >
                Buscar
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-300 rounded-md p-4">
            <h3 className="font-bold mb-4">Tabla de Productos</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  {[
                    "Producto",
                    "Código",
                    "Categoría",
                    "Stock",
                    "Ubicación",
                  ].map((col) => (
                    <th
                      key={col}
                      className="border border-gray-300 px-4 py-2 text-left"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {productos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center px-4 py-6">
                      No se encontraron productos.
                    </td>
                  </tr>
                ) : (
                  productos.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        {p.nombre}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {p.codigo}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {p.categoria}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {p.cantidad}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {p.ubicacion || "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSearch;
