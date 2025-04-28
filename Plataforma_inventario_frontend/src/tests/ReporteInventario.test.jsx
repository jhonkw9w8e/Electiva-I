import { render, screen, fireEvent } from "@testing-library/react";
import ReporteInventario from "../components/ReporteInventario";
import axios from "axios";
jest.mock("axios");

test("exporta mensaje correcto", async () => {
  axios.get.mockResolvedValue({
    data: { message: "Exportando reporte en PDF." },
  });
  render(<ReporteInventario />);
  fireEvent.click(screen.getByText(/Exportar a PDF/));
  const alertMock = jest.spyOn(window, "alert").mockImplementation();
  await screen.findByText(/Exportar a PDF/);
  expect(alertMock).toHaveBeenCalledWith("Exportando reporte en PDF.");
});
