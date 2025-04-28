import React from "react";
import { render, screen } from "@testing-library/react";
import MovimientosTable from "../componentes/MovimientosTable";

describe("MovimientosTable", () => {
  it("renders page title and filters section", () => {
    render(<MovimientosTable />);
    expect(
      screen.getByText(/Visualización de Movimientos/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Filtros/i)).toBeInTheDocument();
  });
});
