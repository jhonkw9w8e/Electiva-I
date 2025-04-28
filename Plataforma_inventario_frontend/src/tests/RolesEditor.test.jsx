import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import RolesEditor from "../src/components/RolesEditor";

vi.mock("axios");

describe("RolesEditor", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: [
        { id: 1, name: "Admin", permissions: [] },
        { id: 2, name: "Usuario", permissions: [] },
      ],
    });
  });

  it("muestra los roles en el select", async () => {
    render(<RolesEditor />);
    await waitFor(() => {
      expect(screen.getByText("Admin")).toBeInTheDocument();
      expect(screen.getByText("Usuario")).toBeInTheDocument();
    });
  });

  it("permite seleccionar un rol", async () => {
    render(<RolesEditor />);
    await waitFor(() => {
      const select = screen.getByRole("combobox");
      fireEvent.change(select, {
        // ahora incluyendo permissions
        target: {
          value: JSON.stringify({ id: 1, name: "Admin", permissions: [] }),
        },
      });
    });
    expect(screen.getByText("Guardar Cambios")).toBeInTheDocument();
  });

  it("envía cambios al guardar", async () => {
    axios.put.mockResolvedValue({ data: {} });

    render(<RolesEditor />);

    await waitFor(() => {
      const select = screen.getByRole("combobox");
      fireEvent.change(select, {
        target: {
          value: JSON.stringify({ id: 1, name: "Admin", permissions: [] }),
        },
      });
    });

    const guardarBtn = screen.getByText("Guardar Cambios");
    fireEvent.click(guardarBtn);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith("/api/roles/1/", {
        id: 1,
        name: "Admin",
        permissions: [],
      });
    });
  });
});
