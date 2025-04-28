import React, { useState } from "react";
import axios from "axios";

const StockUpdateForm = () => {
  const [formData, setFormData] = useState({
    producto: "",
    stockMinimo: "",
    cantidad: "",
    umbralMinimo: "",
    fechaActualizacion: "",
  });
  const [mensajeStockMinimo, setMensajeStockMinimo] = useState("");
  const [mensajeCantidad, setMensajeCantidad] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [stockActual, setStockActual] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "stockMinimo") {
      setMensajeStockMinimo(
        value && parseFloat(value) <= 0 ? "El valor debe ser mayor que 0" : ""
      );
    }
    if (name === "cantidad") {
      setMensajeCantidad(
        value && parseFloat(value) <= 0
          ? "La cantidad debe ser mayor que 0"
          : ""
      );
    }
  };

  const handleObtener = async () => {
    if (!formData.producto.trim()) {
      alert("Ingrese el código del producto");
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `http://127.0.0.1:8000/api/productos/${formData.producto}/actualizar_stock/`
      );
      setStockActual(data.cantidad);
      setFormData((prev) => ({
        ...prev,
        stockMinimo: data.umbral_minimo,
        cantidad: "",
        umbralMinimo: data.umbral_minimo,
        fechaActualizacion: data.fecha_actualizacion,
      }));
      setMensajeExito("Los cambios se guardaron exitosamente.");
    } catch (err) {
      alert(err.response?.data?.detail || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (mensajeStockMinimo || mensajeCantidad) {
      alert("Corrige los errores antes de continuar.");
      return;
    }
    if (!formData.producto.trim()) {
      alert("Debe ingresar el código del producto.");
      return;
    }
    setIsLoading(true);
    try {
      const payload = { nueva_cantidad: parseInt(formData.cantidad, 10) };
      const { data } = await axios.post(
        `http://127.0.0.1:8000/api/productos/${formData.producto}/actualizar_stock/`,
        payload
      );
      setMensajeExito("Se guardaron los cambios.");
      setStockActual(data.cantidad_actual);
      setFormData({
        producto: "",
        stockMinimo: "",
        cantidad: "",
        umbralMinimo: "",
        fechaActualizacion: "",
      });
      setMensajeStockMinimo("");
      setMensajeCantidad("");
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeshacer = () => {
    setFormData({
      producto: "",
      stockMinimo: "",
      cantidad: "",
      umbralMinimo: "",
      fechaActualizacion: "",
    });
    setStockActual(null);
    setMensajeExito("Se han deshecho los cambios automáticamente.");
    setMensajeStockMinimo("");
    setMensajeCantidad("");
  };

  const handleCancelar = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-center p-4">
      <div className="w-full max-w-3xl bg-[#CCF5CC] border border-black rounded-lg p-6 shadow-lg">
        <h1 className="text-center uppercase font-bold text-2xl mb-4 text-[#0056B3]">
          ACTUALIZACIÓN DE STOCK - HU002
        </h1>

        <div className="bg-[#E5FFE5] border border-black rounded-lg p-4 mb-6">
          <h2 className="text-center uppercase font-bold text-xl mb-4 text-[#FFA500]">
            FORMULARIO DE STOCK
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block font-bold mb-1">PRODUCTO</label>
              <input
                name="producto"
                value={formData.producto}
                onChange={handleChange}
                placeholder="Ingrese el código del producto"
                className="w-full px-2 h-10 bg-[#E5E5E5] border border-black rounded"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">STOCK MÍNIMO</label>
              <input
                name="stockMinimo"
                type="number"
                value={formData.stockMinimo}
                readOnly
                className="w-full px-2 h-10 bg-[#E5E5E5] border border-black rounded"
              />
              {mensajeStockMinimo && (
                <p className="mt-1 text-sm text-red-600">
                  {mensajeStockMinimo}
                </p>
              )}
            </div>

            <div>
              <label className="block font-bold mb-1">CANTIDAD</label>
              <input
                name="cantidad"
                type="number"
                value={formData.cantidad}
                onChange={handleChange}
                placeholder="Ingrese la cantidad a ajustar"
                className="w-full px-2 h-10 bg-[#E5E5E5] border border-black rounded"
              />
              {mensajeCantidad && (
                <p className="mt-1 text-sm text-red-600">{mensajeCantidad}</p>
              )}
            </div>

            <div>
              <label className="block font-bold mb-1">UMBRAL MÍNIMO</label>
              <input
                name="umbralMinimo"
                type="number"
                value={formData.umbralMinimo}
                readOnly
                className="w-full px-2 h-10 bg-[#E5E5E5] border border-black rounded"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">
                FECHA ACTUALIZACIÓN
              </label>
              <input
                name="fechaActualizacion"
                type="text"
                value={formData.fechaActualizacion}
                readOnly
                className="w-full px-2 h-10 bg-[#E5E5E5] border border-black rounded"
              />
            </div>

            <div className="flex justify-center gap-8 mt-4">
              <button
                onClick={handleGuardar}
                disabled={isLoading}
                className="w-36 h-10 bg-[#00CCFF] text-black font-bold uppercase border border-black rounded"
              >
                {isLoading ? "Guardando..." : "GUARDAR"}
              </button>
              <button
                onClick={handleCancelar}
                className="w-36 h-10 bg-[#00CCFF] text-black font-bold uppercase border border-black rounded"
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>

        {mensajeExito && (
          <p className="text-center font-bold text-lg text-[#0056B3] mb-6">
            {mensajeExito}
          </p>
        )}

        <div className="flex justify-center gap-8 mt-4">
          <button
            onClick={handleDeshacer}
            className="w-36 h-10 bg-[#FFA500] text-black font-bold uppercase border border-black rounded"
          >
            DESHACER
          </button>
          <button
            onClick={handleCancelar}
            className="w-36 h-10 bg-[#FFA500] text-black font-bold uppercase border border-black rounded"
          >
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockUpdateForm;
