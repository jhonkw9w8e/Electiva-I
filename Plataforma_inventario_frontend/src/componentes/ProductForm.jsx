import React, { useState, useEffect } from "react";
import axios from "axios";

const token = localStorage.getItem("accessToken");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  axios.defaults.headers.common["Content-Type"] = "application/json";
}

const ProductForm = () => {
  const [producto, setProducto] = useState({
    nombre: "",
    codigo: "",
    categoria: "",
    cantidad: "",
    precio: "",
  });
  const [mensajeCodigo, setMensajeCodigo] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [productos, setProductos] = useState([]);

  const validarCodigo = (codigo) => {
    if (codigo === "EXISTENTE")
      return { valido: false, mensaje: "El código ya existe" };
    if (!isNaN(codigo) && parseFloat(codigo) < 0)
      return { valido: false, mensaje: "El valor debe ser mayor que cero" };
    return { valido: true, mensaje: "Código Disponible" };
  };

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const { data } = await axios.get(
          "http://127.0.0.1:8000/api/productos/"
        );
        setProductos(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProductos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto((p) => ({ ...p, [name]: value }));
    if (name === "codigo") setMensajeCodigo(validarCodigo(value).mensaje);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      mensajeCodigo === "El código ya existe" ||
      mensajeCodigo === "El valor debe ser mayor que cero"
    ) {
      alert("Corrija el campo Código Único");
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "http://127.0.0.1:8000/api/productos/",
        producto
      );
      setMensajeExito("Producto Registrado con Éxito");
      setProductos((p) => [...p, data]);
      setProducto({
        nombre: "",
        codigo: "",
        categoria: "",
        cantidad: "",
        precio: "",
      });
      setMensajeCodigo("");
    } catch (err) {
      alert(err.response?.data?.codigo?.[0] || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-center p-4">
      <div className="w-full max-w-3xl bg-[#CCE6CC] border-2 border-black rounded-lg p-6">
        <h1 className="text-center uppercase font-bold text-2xl mb-4 text-[#0056B3]">
          REGISTRO DE PRODUCTOS - HU001
        </h1>
        <div className="bg-[#E5E5E5] border border-black rounded-lg p-4 mb-6">
          <h2 className="text-center uppercase font-bold text-xl mb-4 text-[#FFA500]">
            FORMULARIO DE REGISTRO DE PRODUCTOS
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-bold mb-1 text-black">
                NOMBRE PRODUCTO
              </label>
              <input
                name="nombre"
                value={producto.nombre}
                onChange={handleChange}
                required
                placeholder="Ingrese el nombre"
                className="w-full px-2 h-10 bg-[#D9D9D9] border border-black rounded"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-black">
                CÓDIGO ÚNICO
              </label>
              <input
                name="codigo"
                value={producto.codigo}
                onChange={handleChange}
                required
                placeholder="Ingrese el código único"
                className="w-full px-2 h-10 bg-[#D9D9D9] border border-black rounded"
              />
              {mensajeCodigo && (
                <p
                  className={`mt-1 text-sm ${
                    mensajeCodigo === "Código Disponible"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {mensajeCodigo}
                </p>
              )}
            </div>
            <div>
              <label className="block font-bold mb-1 text-black">
                CATEGORÍA
              </label>
              <select
                name="categoria"
                value={producto.categoria}
                onChange={handleChange}
                required
                className="w-full px-2 h-24 bg-[#D9D9D9] border border-black rounded"
              >
                <option value="">Menú de Opciones Categoría</option>
                <option>Materias Primas</option>
                <option>Productos Terminados</option>
                <option>Herramientas y Equipos</option>
                <option>Consumibles</option>
                <option>Repuestos</option>
                <option>Productos Perecederos</option>
                <option>Productos No Perecederos</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1 text-black">
                  CANTIDAD
                </label>
                <input
                  name="cantidad"
                  type="number"
                  value={producto.cantidad}
                  onChange={handleChange}
                  required
                  placeholder="Ingrese la cantidad"
                  className="w-full px-2 h-10 bg-[#D9D9D9] border border-black rounded"
                />
              </div>
              <div>
                <label className="block font-bold mb-1 text-black">
                  PRECIO
                </label>
                <input
                  name="precio"
                  type="number"
                  step="0.01"
                  value={producto.precio}
                  onChange={handleChange}
                  required
                  placeholder="Ingrese el precio"
                  className="w-full px-2 h-10 bg-[#D9D9D9] border border-black rounded"
                />
              </div>
            </div>
            <p className="text-center text-sm mt-2 text-black">
              Se registrará la fecha y el usuario de forma automática.
            </p>
            <div className="flex justify-center gap-8 mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-36 h-10 bg-[#00CCFF] border border-black uppercase font-bold rounded"
              >
                {isLoading ? "Guardando..." : "GUARDAR"}
              </button>
              <button
                type="reset"
                className="w-36 h-10 bg-[#00CCFF] border border-black uppercase font-bold rounded"
              >
                CANCELAR
              </button>
            </div>
          </form>
        </div>
        {mensajeExito && (
          <p className="text-center font-bold text-lg text-[#0056B3] mb-6">
            {mensajeExito}
          </p>
        )}
        {productos.length > 0 && (
          <div className="border border-black bg-white rounded p-4">
            <h3 className="font-bold text-xl mb-4 text-black">
              Tabla de Productos
            </h3>
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-200">
                  {[
                    "NOMBRE PRODUCTO",
                    "CÓDIGO",
                    "CATEGORÍA",
                    "CANTIDAD",
                    "PRECIO",
                  ].map((h) => (
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
                {productos.map((p, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="border border-black p-2 text-sm">
                      {p.nombre}
                    </td>
                    <td className="border border-black p-2 text-sm">
                      {p.codigo}
                    </td>
                    <td className="border border-black p-2 text-sm">
                      {p.categoria}
                    </td>
                    <td className="border border-black p-2 text-sm text-center">
                      {p.cantidad}
                    </td>
                    <td className="border border-black p-2 text-sm text-right">
                      ${p.precio}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductForm;
