import React from "react";
import { render, screen } from "@testing-library/react";
import ProductSearch from "../componentes/ProductSearch";

describe("ProductSearch", () => {
  it("renders search header and table", () => {
    render(<ProductSearch />);
    expect(screen.getByText(/Filtrado de Productos/i)).toBeInTheDocument();
    expect(screen.getByText(/Tabla de Productos/i)).toBeInTheDocument();
  });
});
