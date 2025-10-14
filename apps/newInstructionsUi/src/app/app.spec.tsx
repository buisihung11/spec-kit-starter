import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './app';

describe('App', () => {
  it('should render successfully', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  describe('Header Section', () => {
    it('should render the main title', () => {
      render(<App />);
      expect(screen.getByText('New Instructions UI')).toBeInTheDocument();
    });

    it('should render the subtitle', () => {
      render(<App />);
      expect(screen.getByText('Microfrontend Remote Application')).toBeInTheDocument();
    });

    it('should render the assignment icon', () => {
      const { container } = render(<App />);
      const icon = container.querySelector('[data-testid="AssignmentIcon"]');
      expect(icon).toBeTruthy();
    });
  });

  describe('Card Sections', () => {
    it('should render Instructions card', () => {
      render(<App />);
      expect(screen.getByText('Instructions')).toBeInTheDocument();
      expect(
        screen.getByText(/This is a placeholder for the instructions module/i)
      ).toBeInTheDocument();
    });

    it('should render Create New card', () => {
      render(<App />);
      expect(screen.getByText('Create New')).toBeInTheDocument();
      expect(
        screen.getByText(/Create new instructions with templates and guidelines/i)
      ).toBeInTheDocument();
    });

    it('should render Templates card', () => {
      render(<App />);
      expect(screen.getByText('Templates')).toBeInTheDocument();
      expect(
        screen.getByText(/Browse and manage instruction templates/i)
      ).toBeInTheDocument();
    });

    it('should render all action buttons', () => {
      render(<App />);
      expect(screen.getByRole('button', { name: /View Instructions/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Create/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Browse/i })).toBeInTheDocument();
    });
  });

  describe('About Section', () => {
    it('should render About This Module section', () => {
      render(<App />);
      expect(screen.getByText('About This Module')).toBeInTheDocument();
    });

    it('should render microfrontend description', () => {
      render(<App />);
      expect(
        screen.getByText(/This is a remotely loaded microfrontend module/i)
      ).toBeInTheDocument();
    });

    it('should render all feature points', () => {
      render(<App />);
      expect(screen.getByText(/Independent deployment and development/i)).toBeInTheDocument();
      expect(screen.getByText(/Shared dependencies with the host application/i)).toBeInTheDocument();
      expect(screen.getByText(/Lazy loading for optimal performance/i)).toBeInTheDocument();
      expect(screen.getByText(/Consistent styling using Material UI/i)).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('should render three cards in the main section', () => {
      const { container } = render(<App />);
      const cards = container.querySelectorAll('.MuiCard-root');
      expect(cards.length).toBe(3);
    });

    it('should render cards with proper headings', () => {
      render(<App />);
      const headings = ['Instructions', 'Create New', 'Templates'];
      headings.forEach((heading) => {
        expect(screen.getByText(heading)).toBeInTheDocument();
      });
    });
  });
});
