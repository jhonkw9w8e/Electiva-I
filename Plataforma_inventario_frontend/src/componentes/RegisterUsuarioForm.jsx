import React, { useState, useEffect } from "react";
import axios from "axios";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    contraseña: "",
  });
  const [users, setUsers] = useState([]);
  const [mensajeExito, setMensajeExito] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(
        "http://127.0.0.1:8000/api/usuarios/registro/"
      );
      setUsers(data);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
    }
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, email, contraseña } = formData;
    if (!nombre.trim() || !email.trim() || !contraseña.trim()) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      const payload = { nombre, email, contraseña };
      const response = await axios.post(
        "http://127.0.0.1:8000/api/usuarios/registro/",
        payload
      );

      const nuevoUsuario = response.data.usuario;
      setMensajeExito("Usuario registrado correctamente.");
      setUsers((prev) => [...prev, nuevoUsuario]);
      setFormData({ nombre: "", email: "", contraseña: "" });
      setTimeout(() => setMensajeExito(""), 3000);
    } catch (err) {
      alert(
        err.response?.data?.email?.[0] ||
          err.response?.data?.contraseña?.[0] ||
          err.message
      );
    }
  };

  const handleCancelar = () => {
    setFormData({ nombre: "", email: "", contraseña: "" });
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-center text-2xl font-bold py-4 bg-gray-100 border-b-2 border-black">
        REGISTRO DE USUARIOS HU004
      </h1>

      <div className="mt-6">
        <div className="bg-[#CCE6CC] border border-black p-6 mb-6 rounded-lg">
          <h2 className="text-center uppercase font-bold text-xl mb-4 text-[#FFA500]">
            FORMULARIO DE REGISTRO DE USUARIO
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-bold mb-1">NOMBRE</label>
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ingrese su nombre"
                className="w-full px-3 py-2 bg-[#D9D9D9] border border-black rounded"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">CORREO ELECTRÓNICO</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ingrese su correo electrónico"
                className="w-full px-3 py-2 bg-[#D9D9D9] border border-black rounded"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">CONTRASEÑA</label>
              <input
                name="contraseña"
                type="password"
                value={formData.contraseña}
                onChange={handleChange}
                placeholder="Ingrese su contraseña"
                className="w-full px-3 py-2 bg-[#D9D9D9] border border-black rounded"
              />
              <p className="text-sm text-gray-700 mt-1">
                La contraseña debe tener mínimo 8 caracteres. Se registra
                automáticamente.
              </p>
            </div>

            <div className="flex justify-center gap-6 mt-4">
              <button
                type="submit"
                className="w-32 py-2 bg-[#00CCFF] border border-black uppercase font-bold rounded"
              >
                GUARDAR
              </button>
              <button
                type="button"
                onClick={handleCancelar}
                className="w-32 py-2 bg-[#00CCFF] border border-black uppercase font-bold rounded"
              >
                CANCELAR
              </button>
            </div>

            {mensajeExito && (
              <p className="mt-4 text-center text-green-600 font-bold">
                {mensajeExito}
              </p>
            )}
          </form>
        </div>

        <div className="border border-black bg-white p-4 rounded-lg">
          <h2 className="text-center font-bold mb-4">TABLA DE USUARIOS</h2>
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-black p-2">NOMBRE</th>
                <th className="border border-black p-2">CORREO ELECTRÓNICO</th>
                <th className="border border-black p-2">CONTRASEÑA</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center p-4">
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="even:bg-gray-50">
                    <td className="border border-black p-2">{user.nombre}</td>
                    <td className="border border-black p-2">{user.email}</td>
                    <td className="border border-black p-2">
                      {user.contraseña}
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

export default RegisterForm;
