import { render, screen } from '@testing-library/react';
import App from '../App';
import { MemoryRouter } from 'react-router-dom';

test('renders lobby content', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/Welcome to Auto Pets Strategy/i)).toBeInTheDocument();
});
