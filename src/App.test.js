import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app without crashing', () => {
  render(<App />);
  const headerElement = screen.getByText(/TerminalPro/i);
  expect(headerElement).toBeInTheDocument();
});
