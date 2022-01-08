// Test home comp
import React from 'react';
import { render, screen, } from '@testing-library/react';
import { BrowserRouter as Router, } from 'react-router-dom';
import Home from '../pages/Home';

describe('Test the register component', () => {
  beforeAll(() => {
    delete window.matchMedia;
    Object.defineProperty(window, 'matchMedia', {
      value: () => {
        return {
          matches: false,
          addListener: () => {},
          removeListener: () => {},
        };
      },
    });
  });
  test('test the search comp', () => {
    render(
      <Router location={history.location}>
        <Home/>
      </Router>
    );
    const location = screen.getByText(/location/);
    expect(location).toBeInTheDocument();
    const dateRange = screen.getByText(/date/);
    expect(dateRange).toBeInTheDocument();
    const beds = screen.getByText(/beds/);
    expect(beds).toBeInTheDocument();
    const minPrice = screen.getByText(/minPrice/);
    expect(minPrice).toBeInTheDocument();
    const maxPrice = screen.getByText(/maxPrice/);
    expect(maxPrice).toBeInTheDocument();
  })
})
