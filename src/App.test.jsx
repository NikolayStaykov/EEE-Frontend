import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

// Mock компонентите, които не са важни за тези тестове
jest.mock('./components/navigation/navBar', () => () => <div data-testid="navbar" />);
jest.mock('./components/cards/DisciplineCard', () => ({ discipline, userRole }) => (
  <div data-testid="discipline-card">{discipline.name}</div>
));
jest.mock('./components/modals/newDisciplineModalDialog', () => () => (
  <div data-testid="new-discipline-modal">New Discipline Modal</div>
));

describe('App Component', () => {
  test('test render header ', () => {
    render(<App />);
    const heading = screen.getByText(/Technical University Of Varna/i);
    expect(heading).toBeInTheDocument();
  });

  test('test render nav bar', () => {
    render(<App />);
    const navbar = screen.getByTestId('navbar');
    expect(navbar).toBeInTheDocument();
  });

  test('test render discipline cards from test data ', () => {
    render(<App />);
    const disciplineCards = screen.getAllByTestId('discipline-card');
    expect(disciplineCards.length).toBe(2);
    expect(disciplineCards[0]).toHaveTextContent('Test Discipline');
    expect(disciplineCards[1]).toHaveTextContent('Test Discipline 2');
  });

  test('test render new discipline button for admin role', () => {
    render(<App />);
    const addDisciplineButton = screen.getByTestId('new-discipline-modal');
    expect(addDisciplineButton).toBeInTheDocument();
  });
  
});