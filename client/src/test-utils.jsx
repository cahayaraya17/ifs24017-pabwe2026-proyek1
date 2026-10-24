import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Helper render bersama MemoryRouter (setara renderWithProviders pada modul P4).
export function renderWithProviders(ui, { route = '/', ...options } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>,
    options,
  );
}

export * from '@testing-library/react';
