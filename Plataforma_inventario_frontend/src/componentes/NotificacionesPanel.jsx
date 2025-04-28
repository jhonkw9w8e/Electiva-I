import React, { useState, useEffect } from "react";
import axios from "axios";

const NotificacionesPanel = () => {
  const [formData, setFormData] = useState({
    nombreProducto: "",
    stockActual: "",
    umbral: "",
    contadorNotificaciones: "",
  });
  const [stockData, setStockData] = useState([]);
  const [mensajeExito, setMensajeExito] = useState("");
  useEffect(() => {
    fetchNotificaciones();
  }, []);

  const fetchNotificaciones = async () => {
    try {
      const { data } = await axios.get(
        "http://127.0.0.1:8000/api/notificaciones/"
      );
      setStockData(data);
    } catch (err) {
      console.error("Error cargando notificaciones:", err);
    }
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const determinarEstado = (stock, umbral) =>
    stock < umbral ? "Bajo" : "Normal";

  const handleEnviarCorreo = async (e) => {
    e.preventDefault();
    const { nombreProducto, stockActual, umbral, contadorNotificaciones } =
      formData;
    if (
      !nombreProducto.trim() ||
      !stockActual ||
      !umbral ||
      !contadorNotificaciones
    ) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }

    try {
      const payload = {
        nombre_producto: nombreProducto,
        stock_actual: parseInt(stockActual, 10),
        umbral_configurado: parseInt(umbral, 10),
        contador_notificaciones: parseInt(contadorNotificaciones, 10),
        estado: parseInt(stockActual, 10) < parseInt(umbral, 10),
      };
      await axios.post("http://127.0.0.1:8000/api/notificaciones/", payload);
      fetchNotificaciones();
      setFormData({
        nombreProducto: "",
        stockActual: "",
        umbral: "",
        contadorNotificaciones: "",
      });
      setMensajeExito("Correo enviado!");
    } catch (err) {
      console.error(err.response?.data?.detail || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-center text-2xl font-bold py-4 bg-gray-100 border-b-2 border-black">
        NOTIFICACIÓN DE STOCK BAJO - HU003
      </h1>

      <div className="mt-6">
        <div className="border border-black bg-gray-100 p-4 mb-6">
          <p className="font-bold">
            MONITOREA LOS PRODUCTOS CUYO STOCK ESTÁ POR DEBAJO DEL UMBRAL
            DEFINIDO
          </p>
        </div>

        <div className="bg-[#C8E6C9] border border-black p-6 mb-6 rounded-lg">
          <form onSubmit={handleEnviarCorreo} className="space-y-4">
            <div>
              <label className="block font-bold mb-1">
                NOMBRE DEL PRODUCTO:
              </label>
              <input
                name="nombreProducto"
                value={formData.nombreProducto}
                onChange={handleChange}
                placeholder="Ingrese el nombre del producto"
                className="w-full px-3 py-2 bg-[#D9D9D9] border border-black rounded"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">STOCK ACTUAL:</label>
              <input
                name="stockActual"
                type="number"
                value={formData.stockActual}
                onChange={handleChange}
                placeholder="Ingrese el stock actual"
                className="w-full px-3 py-2 bg-[#D9D9D9] border border-black rounded"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">
                UMBRAL CONFIGURADO:
              </label>
              <input
                name="umbral"
                type="number"
                value={formData.umbral}
                onChange={handleChange}
                placeholder="Ingrese el umbral"
                className="w-full px-3 py-2 bg-[#D9D9D9] border border-black rounded"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">
                CONTADOR DE NOTIFICACIONES:
              </label>
              <input
                name="contadorNotificaciones"
                type="number"
                value={formData.contadorNotificaciones}
                onChange={handleChange}
                placeholder="Ingrese el contador de notificaciones"
                className="w-full px-3 py-2 bg-[#D9D9D9] border border-black rounded"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">ESTADO:</label>
              <input
                type="text"
                value={
                  formData.stockActual && formData.umbral
                    ? determinarEstado(
                        parseInt(formData.stockActual, 10),
                        parseInt(formData.umbral, 10)
                      )
                    : ""
                }
                readOnly
                className="w-full px-3 py-2 bg-gray-200 border border-black rounded"
                placeholder="Bajo o Normal"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2 bg-[#FFEB3B] border border-black font-bold uppercase rounded"
            >
              ENVIAR CORREO
            </button>

            {mensajeExito && (
              <p className="mt-2 text-green-600 font-bold">{mensajeExito}</p>
            )}
          </form>
        </div>

        <div className="border border-black bg-white p-4 rounded-lg">
          <h2 className="text-center font-bold mb-4">TABLA DE STOCK</h2>
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-black p-2">NOMBRE DEL PRODUCTO</th>
                <th className="border border-black p-2">STOCK ACTUAL</th>
                <th className="border border-black p-2">UMBRAL</th>
                <th className="border border-black p-2">CONTADOR</th>
                <th className="border border-black p-2">ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {stockData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-4">
                    No hay datos
                  </td>
                </tr>
              ) : (
                stockData.map((item) => (
                  <tr
                    key={item.id}
                    className={
                      determinarEstado(
                        item.stock_actual,
                        item.umbral_configurado
                      ) === "Bajo"
                        ? "bg-red-50"
                        : "bg-white"
                    }
                  >
                    <td className="border border-black p-2">
                      {item.nombre_producto}
                    </td>
                    <td className="border border-black p-2">
                      {item.stock_actual}
                    </td>
                    <td className="border border-black p-2">
                      {item.umbral_configurado}
                    </td>
                    <td className="border border-black p-2">
                      {item.contador_notificaciones}
                    </td>
                    <td className="border border-black p-2">
                      {determinarEstado(
                        item.stock_actual,
                        item.umbral_configurado
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NotificacionesPanel;
