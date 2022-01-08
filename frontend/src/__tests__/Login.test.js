// Test register comp
import React from 'react';
import { render, screen, fireEvent, } from '@testing-library/react';
import { createMemoryHistory, } from 'history';
import { BrowserRouter as Router, } from 'react-router-dom';
import Login from '../pages/Login';

const mockRegister = {
  email: 'z5242236@unsw.edu.au',
  password: 'mypassword',
}

describe('Test the register component', () => {
  beforeAll(() => {
    delete window.matchMedia;
    Object.defineProperty(window, 'matchMedia', {
      value: () => {
        return {
          matches: false,
          addListener: () => { },
          removeListener: () => { },
        };
      },
    });
  });

  // test the inputs on the register page
  test('test login inputs', () => {
    const history = createMemoryHistory();
    const { container, } = render(
      <Router location={history.location}>
        <Login />
      </Router>
    );
    const inputEmail = container.querySelector('#email');
    expect(inputEmail.value).toBe('');
    fireEvent.change(inputEmail, { target: { value: mockRegister.email, }, });
    expect(inputEmail.value).toBe(mockRegister.email);

    const inputPassword = container.querySelector('#password');
    expect(inputPassword.value).toBe('');
    fireEvent.change(inputPassword, { target: { value: mockRegister.password, }, });
    expect(inputPassword.value).toBe(mockRegister.password);
  })
  test('test login button', () => {
    const history = createMemoryHistory();
    render(
      <Router location={history.location}>
        <Login />
      </Router>
    );
    const submit = screen.getByText(/Submit/);
    expect(submit).toBeInTheDocument();
  })
})
