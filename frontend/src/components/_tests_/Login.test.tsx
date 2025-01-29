import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../utils/test-utils';
import Login from '../Login';
import { useAuth } from '../../context/AuthContext';

// Mock useAuth hook
jest.mock('../../context/AuthContext');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('Login Component', () => {
  beforeEach(() => {
    mockUseAuth.mockImplementation(() => ({
      login: jest.fn(),
      state: {
        loading: false,
        error: null,
        isAuthenticated: false,
        user: null
      }
    }));
  });

  it('renders login form', () => {
    render(<Login />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const mockLogin = jest.fn();
    mockUseAuth.mockImplementation(() => ({
      login: mockLogin,
      state: {
        loading: false,
        error: null,
        isAuthenticated: false,
        user: null
      }
    }));

    render(<Login />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('displays error message when login fails', () => {
    mockUseAuth.mockImplementation(() => ({
      login: jest.fn(),
      state: {
        loading: false,
        error: 'Invalid credentials',
        isAuthenticated: false,
        user: null
      }
    }));

    render(<Login />);
    
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('shows loading state during login', () => {
    mockUseAuth.mockImplementation(() => ({
      login: jest.fn(),
      state: {
        loading: true,
        error: null,
        isAuthenticated: false,
        user: null
      }
    }));

    render(<Login />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
