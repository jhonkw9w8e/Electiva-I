import React, { useState, useEffect } from "react";
import axios from "axios";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ nombre: "", email: "", rol: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/usuarios/registro/"
        );
        setUsers(res.data);
      } catch (err) {
        console.error("Error cargando usuarios:", err);
        setMessage("Error al cargar usuarios.");
      }
    };
    fetchUsers();
  }, []);

  const selectRow = (user) => {
    setSelectedUser(user);
    setFormData({ nombre: user.nombre, email: user.email, rol: user.rol });
    setMessage("");
  };

  const handleEdit = async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/usuarios/registro/${selectedUser.id}/`,
        formData
      );
      const res = await axios.get(
        "http://127.0.0.1:8000/api/usuarios/registro/"
      );
      setUsers(res.data);
      setSelectedUser(null);
      setFormData({ nombre: "", email: "", rol: "" });
      setMessage("Usuario actualizado exitosamente.");
    } catch (err) {
      console.error("Error editando usuario:", err);
      setMessage("Error al editar usuario.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/usuarios/registro/${selectedUser.id}/`
      );
      const res = await axios.get(
        "http://127.0.0.1:8000/api/usuarios/registro/"
      );
      setUsers(res.data);
      setSelectedUser(null);
      setFormData({ nombre: "", email: "", rol: "" });
      setMessage("Usuario eliminado exitosamente.");
    } catch (err) {
      console.error("Error eliminando usuario:", err);
      setMessage("Error al eliminar usuario.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.nombre || !formData.email || !formData.rol) return;
    setLoading(true);
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/usuarios/assign-groups/",
        formData
      );
      const res = await axios.get(
        "http://127.0.0.1:8000/api/usuarios/registro/"
      );
      setUsers(res.data);
      setFormData({ nombre: "", email: "", rol: "" });
      setMessage("Usuario registrado exitosamente.");
    } catch (err) {
      console.error("Error registrando usuario:", err);
      setMessage("Error al registrar usuario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-center text-2xl font-bold mb-6">
        GESTIÓN DE USUARIOS Y PERMISOS HU010
      </h1>

      <div className="overflow-auto border border-black rounded-lg p-4 bg-gray-50">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left">NOMBRE</th>
              <th className="border p-2 text-left">CORREO ELECTRÓNICO</th>
              <th className="border p-2 text-left">ROL</th>
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
              users.map((user, idx) => (
                <tr
                  key={user.id}
                  onClick={() => selectRow(user)}
                  className={`cursor-pointer ${
                    selectedUser?.id === user.id ? "ring-2 ring-blue-400" : ""
                  } ${idx % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
                >
                  <td className="border p-2">{user.nombre}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.rol}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-6 mt-8">
        <button
          onClick={handleEdit}
          disabled={!selectedUser || loading}
          className="w-32 h-12 border border-black rounded hover:bg-blue-50 disabled:opacity-50"
        >
          EDITAR
        </button>
        <button
          onClick={handleDelete}
          disabled={!selectedUser || loading}
          className="w-32 h-12 border border-black rounded hover:bg-red-50 disabled:opacity-50"
        >
          ELIMINAR
        </button>
      </div>

      <div className="max-w-md w-full border border-black rounded p-6 mx-auto mt-8">
        <h2 className="text-lg font-semibold mb-4">Registrar nuevo usuario</h2>
        <label className="block font-bold mb-1">Nombre:</label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          className="w-full px-2 py-1 border rounded mb-4"
        />
        <label className="block font-bold mb-1">Correo Electrónico:</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-2 py-1 border rounded mb-4"
        />
        <label className="block font-bold mb-1">Rol:</label>
        <input
          type="text"
          value={formData.rol}
          onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
          className="w-full px-2 py-1 border rounded mb-6"
        />
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full px-4 py-2 border border-black rounded hover:bg-green-50"
        >
          Registrar
        </button>
      </div>

      {message && (
        <div className="fixed bottom-6 right-6 w-64 p-4 bg-white border rounded text-xs text-center">
          {message}
        </div>
      )}
    </div>
  );
}
