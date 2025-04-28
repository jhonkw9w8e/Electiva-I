import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
import UserManagement from "./UserManagement";

jest.mock("axios");

describe("UserManagement component", () => {
  const mockUsers = [
    {
      id: 1,
      username: "juan",
      email: "juan@example.com",
      groups: [{ id: 1, name: "Admin" }],
    },
    {
      id: 2,
      username: "ana",
      email: "ana@example.com",
      groups: [{ id: 2, name: "Usuario" }],
    },
  ];
  const mockRoles = [
    { id: 1, name: "Admin" },
    { id: 2, name: "Usuario" },
  ];

  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      if (url === "/api/usuarios/") {
        return Promise.resolve({ data: mockUsers });
      }
      if (url === "/api/roles/") {
        return Promise.resolve({ data: mockRoles });
      }
      return Promise.resolve({ data: [] });
    });
    axios.post.mockResolvedValue({});
    axios.delete.mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("muestra lista de usuarios y roles", async () => {
    render(<UserManagement />);

    // Esperar a que carguen usuarios
    await waitFor(() => {
      expect(screen.getByText("juan")).toBeInTheDocument();
      expect(screen.getByText("ana")).toBeInTheDocument();
    });

    // Roles en el select
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(mockRoles.length);
    expect(options[0]).toHaveTextContent("Admin");
    expect(options[1]).toHaveTextContent("Usuario");
  });

  test("crea un nuevo usuario", async () => {
    render(<UserManagement />);

    // Rellenar formulario
    fireEvent.change(screen.getByLabelText(/Usuario/i), {
      target: { value: "pedro" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "pedro@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Roles/i), {
      target: { options: [{ selected: true, value: "2" }] },
    });

    // Click crear
    fireEvent.click(screen.getByText("Crear"));

    await waitFor(() => {
      // axios.post debe haberse llamado con URL y datos
      expect(axios.post).toHaveBeenCalledWith("/api/usuarios/", {
        username: "pedro",
        email: "pedro@example.com",
        groups: ["2"],
      });
    });
  });

  test("elimina un usuario", async () => {
    render(<UserManagement />);

    // Esperar usuarios
    await waitFor(() => expect(screen.getByText("juan")).toBeInTheDocument());

    // Click borrar en la fila de Juan
    const deleteButtons = screen.getAllByText("Eliminar");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith("/api/usuarios/1/");
    });
  });
});
