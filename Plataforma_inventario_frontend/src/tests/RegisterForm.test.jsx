import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import RegisterForm from "../components/RegisterForm";

describe("RegisterForm", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [] });
  });

  it("registers a new user and updates table", async () => {
    const newUser = {
      id: 1,
      nombre: "User",
      email: "u@test.com",
      contraseña: "pass1234",
    };
    axios.post.mockResolvedValue({
      data: { message: "Usuario registrado correctamente", usuario: newUser },
    });

    render(<RegisterForm />);
    fireEvent.change(screen.getByPlaceholderText(/Ingrese su nombre/i), {
      target: { value: "User" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/Ingrese su correo electrónico/i),
      { target: { value: "u@test.com" } }
    );
    fireEvent.change(screen.getByPlaceholderText(/Ingrese su contraseña/i), {
      target: { value: "pass1234" },
    });
    fireEvent.click(screen.getByText(/GUARDAR/i));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    expect(await screen.findByText(/User/)).toBeInTheDocument();
    expect(
      screen.getByText(/Usuario registrado correctamente/i)
    ).toBeInTheDocument();
  });
});
