import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import StockUpdateForm from "../components/StockUpdateForm";

describe("StockUpdateForm", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        cantidad: 10,
        umbral_minimo: 5,
        fecha_actualizacion: "2025-01-01T00:00:00Z",
      },
    });
  });

  it("fetches stock data on Obtener click and displays it", async () => {
    render(<StockUpdateForm />);
    fireEvent.change(
      screen.getByPlaceholderText(/Ingrese el código del producto/i),
      { target: { value: "ABC" } }
    );
    fireEvent.click(screen.getByText(/OBTENER/i));
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    expect(screen.getByDisplayValue("5")).toBeInTheDocument(); // umbral mínimo mostrado
    expect(
      screen.getByText(/Datos obtenidos correctamente/i)
    ).toBeInTheDocument();
  });
});
