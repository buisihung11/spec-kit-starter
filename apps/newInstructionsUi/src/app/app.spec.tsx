import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from './app';

/**
 * Helper function to render App with routing context
 */
function renderWithRouter(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  );
}

describe('App', () => {
  it('should render successfully', () => {
    const { container } = renderWithRouter();
    expect(container).toBeTruthy();
  });

  describe('Root Route', () => {
    it('should render the question set list route by default', () => {
      renderWithRouter('/');
      expect(screen.getByText('Question Set Management')).toBeInTheDocument();
      expect(
        screen.getByText('Select a question set to view and fill out the form')
      ).toBeInTheDocument();
    });
  });
});
