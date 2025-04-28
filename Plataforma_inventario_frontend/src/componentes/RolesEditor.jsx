import React, { useState, useEffect } from "react";
import axios from "axios";

export default function RoleAccessControl() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({ nombre: "", email: "", rol: "" });
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  const API = "http://127.0.0.1:8000/api";
  const roles = [
    { id: "Administrador", name: "Administrador" },
    { id: "Editor", name: "Editor" },
  ];

  // Carga inicial de usuarios
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/usuarios/registro/`);
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.results || [];
        setUsers(data);
      } catch (err) {
        console.error("Error cargando usuarios:", err);
        setUsers([]);
      }
    })();
  }, []);

  const handleRowClick = (u) => {
    setSelectedUser(u);
    setShowForm(false);
    setMessage("");
  };

  const handleEditClick = () => {
    if (!selectedUser) {
      alert("Selecciona primero un usuario.");
      return;
    }
    setForm({
      nombre: selectedUser.nombre,
      email: selectedUser.email,
      rol: selectedUser.rol || "",
    });
    setShowForm(true);
    setMessage("");
  };

  const handleCancel = () => {
    setShowForm(false);
    setMessage("");
  };

  const handleSave = async () => {
    try {
      await axios.post(`${API}/assign-editor/`, {
        email: selectedUser.email,
        role: form.rol,
      });
      setMessage("Los cambios se guardaron correctamente");
      const res = await axios.get(`${API}/usuarios/registro/`);
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setUsers(data);
      setShowForm(false);
    } catch (err) {
      console.error("Error guardando cambios:", err);
      const detail =
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        "Error desconocido";
      alert("No se pudieron guardar los cambios:\n" + detail);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-center text-2xl font-bold mb-6">
        CONTROL DE ACCESO POR ROLES HU009
      </h1>

      <div className="max-w-3xl mx-auto bg-gray-100 border border-black rounded-lg p-4">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">NOMBRE</th>
              <th className="border p-2">CORREO ELECTRÓNICO</th>
              <th className="border p-2">ROL</th>
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
              users.map((u, i) => (
                <tr
                  key={u.id}
                  onClick={() => handleRowClick(u)}
                  className={`cursor-pointer ${
                    selectedUser?.id === u.id
                      ? "bg-blue-100"
                      : i % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50"
                  }`}
                >
                  <td className="border p-2">{u.nombre}</td>
                  <td className="border p-2">{u.email}</td>
                  <td className="border p-2">{u.rol}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex justify-center mt-4">
          <button
            onClick={handleEditClick}
            className="bg-[#00CCFF] text-black font-bold uppercase border border-black px-6 py-2 rounded"
          >
            EDITAR PERMISOS
          </button>
        </div>
      </div>

      {showForm && (
        <div className="max-w-3xl mx-auto bg-[#C8E6C9] border border-black rounded-lg p-6 mt-6">
          <h2 className="text-center uppercase font-bold text-xl mb-4 text-[#FFA500]">
            FORMULARIO DE EDICIÓN DE PERMISOS
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block font-bold mb-1">NOMBRE</label>
              <input
                type="text"
                value={form.nombre}
                readOnly
                className="w-full px-2 h-10 bg-[#D9D9D9] border border-black rounded"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">CORREO ELECTRÓNICO</label>
              <input
                type="email"
                value={form.email}
                readOnly
                className="w-full px-2 h-10 bg-[#D9D9D9] border border-black rounded"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">ROL</label>
              <select
                value={form.rol}
                onChange={(e) => setForm({ ...form, rol: e.target.value })}
                className="w-full px-2 h-10 bg-[#D9D9D9] border border-black rounded"
              >
                <option value="">Selecciona un rol</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={handleSave}
                className="w-1/2 mr-2 bg-[#00FFFF] border border-black py-3 uppercase font-bold rounded"
              >
                GUARDAR CAMBIOS
              </button>
              <button
                onClick={handleCancel}
                className="w-1/2 ml-2 bg-[#00FFFF] border border-black py-3 uppercase font-bold rounded"
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}

      {message && (
        <p className="mt-4 text-green-600 font-bold text-center">{message}</p>
      )}
    </div>
  );
}
