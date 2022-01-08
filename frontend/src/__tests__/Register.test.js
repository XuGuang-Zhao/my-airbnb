// Test register comp
import React from 'react';
import { render, screen, fireEvent, } from '@testing-library/react';
import { createMemoryHistory, } from 'history';
import { BrowserRouter as Router, } from 'react-router-dom';
import Register from '../pages/Register';

const mockRegister = {
  email: 'z5242236@unsw.edu.au',
  password: 'mypassword',
  name: 'YinuoLi'
}

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

  // test the inputs on the register page
  test('test the inputs on the register page', () => {
    const history = createMemoryHistory();
    render(
      <Router location={history.location}>
        <Register/>
      </Router>
    );
    const emailInput = screen.getByText(/E-mail/i);
    expect(emailInput).toBeInTheDocument();
    const nameInput = screen.getByText(/Name/i);
    expect(nameInput).toBeInTheDocument();
    const passwordInput = screen.getByText(/Password/);
    expect(passwordInput).toBeInTheDocument();
    const confirmPasswordInput = screen.getByText(/Confirm password/);
    expect(confirmPasswordInput).toBeInTheDocument();
  })

  test('test register', () => {
    const history = createMemoryHistory();
    const { container, } = render(
      <Router location={history.location}>
        <Register/>
      </Router>
    );
    const inputEmail = container.querySelector('#email');
    expect(inputEmail.value).toBe('');
    fireEvent.change(inputEmail, { target: { value: mockRegister.email, }, });
    expect(inputEmail.value).toBe(mockRegister.email);

    const inputName = container.querySelector('#name');
    expect(inputName.value).toBe('');
    fireEvent.change(inputName, { target: { value: mockRegister.name, }, });
    expect(inputName.value).toBe(mockRegister.name);

    const inputPassword = container.querySelector('#password');
    expect(inputPassword.value).toBe('');
    fireEvent.change(inputPassword, { target: { value: mockRegister.password, }, });
    expect(inputPassword.value).toBe(mockRegister.password);
  })
})
