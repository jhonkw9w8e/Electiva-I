import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import NotificacionesPanel from "../componentes/NotificacionesPanel";

describe("NotificacionesPanel", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [] });
  });

  it("renders notification panel title", () => {
    render(<NotificacionesPanel />);
    expect(
      screen.getByText(/NOTIFICACIÓN DE STOCK BAJO - HU003/i)
    ).toBeInTheDocument();
  });

  it("adds a new notification row after send", async () => {
    const newNotif = {
      id: 1,
      nombre_producto: "P1",
      stock_actual: 2,
      umbral_configurado: 5,
    };
    axios.post.mockResolvedValue({});
    axios.get
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: [newNotif] });

    render(<NotificacionesPanel />);
    fireEvent.change(
      screen.getByPlaceholderText(/Ingrese el nombre del producto/i),
      { target: { value: "P1" } }
    );
    fireEvent.change(screen.getByPlaceholderText(/Ingrese el stock actual/i), {
      target: { value: 2 },
    });
    fireEvent.change(screen.getByPlaceholderText(/Ingrese el umbral/i), {
      target: { value: 5 },
    });
    fireEvent.click(screen.getByText(/ENVIAR CORREO/i));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    expect(screen.getByText(/P1/)).toBeInTheDocument();
  });
});
