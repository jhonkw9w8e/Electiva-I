import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import DevolucionForm from './DevolucionForm';

jest.mock('axios');

describe('DevolucionForm component', () => {
  const mockList = [
    { id: 1, producto: 'Prod1', cantidad: 2, motivo: 'Daño', fecha: '2025-04-20', usuario: 'juan' },
    { id: 2, producto: 'Prod2', cantidad: 1, motivo: 'Error', fecha: '2025-04-21', usuario: 'ana' }
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockList });
    axios.post.mockResolvedValue({});
    window.alert = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('muestra la lista de devoluciones al cargar', async () => {
    render(<DevolucionForm />);

    await waitFor(() => {
      expect(screen.getByText('Prod1')).toBeInTheDocument();
      expect(screen.getByText('Prod2')).toBeInTheDocument();
      expect(screen.getByText('Daño')).toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
    });
  });

  test('guarda nueva devolución y recarga la lista', async () => {
    render(<DevolucionForm />);

    // Rellenar formulario
    fireEvent.change(screen.getByLabelText(/Producto devuelto/i), { target: { value: 'NuevoProd' } });
    fireEvent.change(screen.getByLabelText(/Cantidad/i),        { target: { value: '3' } });
    fireEvent.change(screen.getByLabelText(/Motivo/i),          { target: { value: 'TestMotivo' } });

    // Hacer clic en guardar
    fireEvent.click(screen.getByText('Guardar Devolución'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        '/api/devoluciones/',
        { producto: 'NuevoProd', cantidad: '3', motivo: 'TestMotivo', reincorpora: true }
      );
      expect(window.alert).toHaveBeenCalledWith('Devolución registrada');
    });

    // Debería volver a cargar la lista
    expect(axios.get).toHaveBeenCalledWith('/api/devoluciones/');
  });
});
