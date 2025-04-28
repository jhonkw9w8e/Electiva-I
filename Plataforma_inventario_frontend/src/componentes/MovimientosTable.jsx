import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const MovimientosPage = () => {
  const [productos, setProductos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [filtros, setFiltros] = useState({
    fecha_desde: "",
    fecha_hasta: "",
    producto: "",
    tipo: "Ambos",
    all: true,
  });
  const [form, setForm] = useState({
    producto: "",
    tipo_movimiento: "Entrada",
    cantidad: "",
  });
  const [lastQuery, setLastQuery] = useState("sin filtros");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const { data } = await axios.get(
          "http://127.0.0.1:8000/api/productos/"
        );
        setProductos(data);
      } catch (err) {
        console.error("Error cargando productos:", err);
      }
    };
    fetchProductos();
    fetchMovimientos();
  }, []);

  const fetchMovimientos = useCallback(async () => {
    const params = new URLSearchParams();
    filtros.fecha_desde && params.append("fecha_desde", filtros.fecha_desde);
    filtros.fecha_hasta && params.append("fecha_hasta", filtros.fecha_hasta);
    filtros.producto && params.append("producto", filtros.producto);
    filtros.tipo !== "Ambos" && params.append("tipo_movimiento", filtros.tipo);
    filtros.all && params.append("all", "1");
    const qs = params.toString();
    setLastQuery(qs || "sin filtros");
    try {
      const { data } = await axios.get(
        `http://127.0.0.1:8000/api/movimientos/?${qs}`
      );
      setMovimientos(data);
    } catch (err) {
      console.error("Error cargando movimientos:", err);
    }
  }, [filtros]);

  const saveMovimiento = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/movimientos/", {
        producto: form.producto,
        tipo_movimiento: form.tipo_movimiento,
        cantidad: Number(form.cantidad),
      });
      setForm({ producto: "", tipo_movimiento: "Entrada", cantidad: "" });
      fetchMovimientos();
    } catch (err) {
      alert("Error al guardar movimiento: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center p-4">
      <div className="w-full max-w-4xl bg-[#CCE6CC] border-2 border-black rounded-lg p-6">
        <h1 className="text-center uppercase font-bold text-2xl mb-6 text-[#0056B3]">
          VISUALIZACIÓN DE MOVIMIENTOS - HU005
        </h1>

        <section className="mb-6">
          <h2 className="font-bold mb-2">Filtros</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-sm mb-2">
            <input
              type="date"
              value={filtros.fecha_desde}
              onChange={(e) =>
                setFiltros((f) => ({ ...f, fecha_desde: e.target.value }))
              }
              className="border border-black px-2 py-1 rounded"
            />
            <input
              type="date"
              value={filtros.fecha_hasta}
              onChange={(e) =>
                setFiltros((f) => ({ ...f, fecha_hasta: e.target.value }))
              }
              className="border border-black px-2 py-1 rounded"
            />
            <select
              value={filtros.producto}
              onChange={(e) =>
                setFiltros((f) => ({ ...f, producto: e.target.value }))
              }
              className="border border-black px-2 py-1 rounded"
            >
              <option value="">Todos los Productos</option>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
            <select
              value={filtros.tipo}
              onChange={(e) =>
                setFiltros((f) => ({ ...f, tipo: e.target.value }))
              }
              className="border border-black px-2 py-1 rounded"
            >
              <option>Ambos</option>
              <option>Entrada</option>
              <option>Salida</option>
            </select>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={filtros.all}
                onChange={(e) =>
                  setFiltros((f) => ({ ...f, all: e.target.checked }))
                }
              />
              Mostrar todos
            </label>
          </div>
          <button
            onClick={fetchMovimientos}
            className="px-4 py-2 bg-[#00CCFF] border border-black uppercase font-bold rounded"
          >
            Aplicar
          </button>
        </section>

        <section className="mb-6 bg-[#C8E6C9] border border-black rounded-lg p-4">
          <h2 className="font-bold mb-4">
            FORMULARIO DE REGISTRO DE MOVIMIENTOS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <select
              value={form.producto}
              onChange={(e) =>
                setForm((f) => ({ ...f, producto: e.target.value }))
              }
              className="border border-black px-2 py-2 rounded bg-[#D9D9D9]"
            >
              <option value="">Seleccione Producto</option>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
            <select
              value={form.tipo_movimiento}
              onChange={(e) =>
                setForm((f) => ({ ...f, tipo_movimiento: e.target.value }))
              }
              className="border border-black px-2 py-2 rounded bg-[#D9D9D9]"
            >
              <option>Entrada</option>
              <option>Salida</option>
            </select>
            <input
              type="number"
              placeholder="Cantidad"
              value={form.cantidad}
              onChange={(e) =>
                setForm((f) => ({ ...f, cantidad: e.target.value }))
              }
              className="border border-black px-2 py-2 rounded bg-[#D9D9D9]"
            />
          </div>
          <p className="text-sm mb-4">
            Se registrará la fecha automáticamente.
          </p>
          <div className="flex justify-center gap-6">
            <button
              onClick={saveMovimiento}
              className="px-6 py-2 bg-[#00CCFF] border border-black uppercase font-bold rounded"
            >
              Guardar
            </button>
            <button
              onClick={() =>
                setForm({
                  producto: "",
                  tipo_movimiento: "Entrada",
                  cantidad: "",
                })
              }
              className="px-6 py-2 bg-[#00CCFF] border border-black uppercase font-bold rounded"
            >
              Cancelar
            </button>
          </div>
        </section>

        <section>
          <h2 className="font-bold mb-2">Tabla de Movimientos</h2>
          <p className="italic mb-2">
            Resultados para: <strong>{lastQuery}</strong>
          </p>
          <div className="border border-black bg-white rounded-lg p-4">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-200">
                  {["Fecha", "Producto", "Tipo", "Cantidad"].map((h) => (
                    <th
                      key={h}
                      className="border border-black p-2 font-bold text-sm"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {movimientos.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center p-4">
                      No hay movimientos registrados.
                    </td>
                  </tr>
                ) : (
                  movimientos.map((m) => (
                    <tr
                      key={m.id}
                      className={
                        m.tipo_movimiento === "Salida"
                          ? "bg-red-50"
                          : "bg-white"
                      }
                    >
                      <td className="border border-black p-2 text-sm">
                        {new Date(m.fecha).toLocaleString()}
                      </td>
                      <td className="border border-black p-2 text-sm">
                        {m.producto_nombre}
                      </td>
                      <td className="border border-black p-2 text-sm">
                        {m.tipo_movimiento}
                      </td>
                      <td className="border border-black p-2 text-sm text-center">
                        {m.cantidad}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MovimientosPage;
