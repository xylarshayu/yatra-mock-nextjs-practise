
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '@/pages/index';
import { useRouter } from 'next/router';
import cities from '@/data/cities.json';

// Mocking external dependencies, eg. APIs and router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/data/cities.json', () => ['Delhi', 'Mumbai', 'Bangalore']);

describe('Home Page', () => {
  const mockRouter = {
    route: '/',
    pathname: '',
    query: '',
    asPath: '',
    push: jest.fn(),
  };
  
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders the search form', () => {
    render(<Home />);
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/check-in/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/check-out/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/guests/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('shows specific validation errors for each empty field', async () => {
    render(<Home />);
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    // Using `findByText` waits for the element to appear
    expect(await screen.findByText('City is required')).toBeInTheDocument();
    expect(await screen.findByText('Check-in date is required')).toBeInTheDocument();
    expect(await screen.findByText('Check-out date is required')).toBeInTheDocument();
    expect(await screen.findByText('Guests is required')).toBeInTheDocument();
  });

  it('validates check-out date is after check-in date', async () => {
    render(<Home />);
    fireEvent.change(screen.getByLabelText(/check-in/i), { target: { value: '2025-07-20' } });
    fireEvent.change(screen.getByLabelText(/check-out/i), { target: { value: '2025-07-19' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(await screen.findByText(/check-out date must be after check-in/i)).toBeInTheDocument();
  });

  it('allows a user to select a city from autocomplete suggestions', async () => {
    render(<Home />);
    
    const cityInput = screen.getByLabelText(/city/i);
    
    // Simulate user typing
    fireEvent.change(cityInput, { target: { value: 'Del' } });

    // Find and click the suggestion (assuming it's a button or listitem)
    const suggestion = await screen.findByRole('option', { name: /Delhi/i });
    fireEvent.click(suggestion);

    // Assert that the input now holds the selected value
    expect(cityInput).toHaveValue('Delhi');
  });

  it('navigates to /hotels on valid submission', () => {
    render(<Home />);

    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'Delhi' } });
    fireEvent.change(screen.getByLabelText(/check-in/i), { target: { value: '2025-07-20' } });
    fireEvent.change(screen.getByLabelText(/check-out/i), { target: { value: '2025-07-22' } });
    fireEvent.change(screen.getByLabelText(/guests/i), { target: { value: '2' } });

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: '/hotels',
      query: {
        city: 'Delhi',
        checkin: '2025-07-20',
        checkout: '2025-07-22',
        guests: '2',
      },
    });
  });
});
