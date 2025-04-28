import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import ProductForm from "../componentes/ProductForm";

describe("ProductForm", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [] });
  });

  it("renders form title and inputs", () => {
    render(<ProductForm />);
    expect(
      screen.getByText(/REGISTRO DE PRODUCTOS - HU001/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Ingrese el nombre/i)
    ).toBeInTheDocument();
  });

  it("submits new product and updates table", async () => {
    const newProduct = {
      id: 1,
      nombre: "Test",
      codigo: "123",
      categoria: "Consumibles",
      cantidad: 5,
      precio: 10,
    };
    axios.post.mockResolvedValue({ data: newProduct });
    render(<ProductForm />);

    fireEvent.change(screen.getByPlaceholderText(/Ingrese el nombre/i), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Ingrese el código único/i), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Consumibles" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Ingrese la cantidad/i), {
      target: { value: 5 },
    });
    fireEvent.change(screen.getByPlaceholderText(/Ingrese el precio/i), {
      target: { value: 10 },
    });

    fireEvent.click(screen.getByText(/GUARDAR/i));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    expect(screen.getByText(/Test/)).toBeInTheDocument();
    expect(
      screen.getByText(/Producto Registrado con Éxito/i)
    ).toBeInTheDocument();
  });
});
