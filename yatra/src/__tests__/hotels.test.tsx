
import { render, screen, fireEvent } from '@testing-library/react';
import Hotels from '@/pages/hotels/index';
import { useRouter } from 'next/router';
import { fetchHotels } from '@/lib/api';
import hotels from '@/data/hotels.json';
import cities from '@/data/cities.json';
import { Hotel } from '@/types';

// Mocking external dependencies, eg. APIs and router
jest.mock('@/lib/api');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Hotels Page', () => {
  const exampleCity = cities[0];
  const exampleHotels = hotels.slice(0, 10).filter(hotel => hotel.city == exampleCity) as Hotel[];
  
  const mockRouter = {
    route: '/hotels',
    pathname: '/hotels',
    query: { city: exampleCity, checkin: '2025-07-20', checkout: '2025-07-22', guests: '2' },
    asPath: `/hotels?city=${exampleCity}&checkin=2025-07-20&checkout=2025-07-22&guests=2`,
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (fetchHotels as jest.Mock).mockResolvedValue({
      hotels: exampleHotels,
      totalPages: Math.ceil(hotels.length / 10),
      currentPage: 1,
    });
  });

  it('displays a loading indicator while fetching hotels', async () => {
    // Create a promise that never resolves to simulate loading state
    (fetchHotels as jest.Mock).mockReturnValue(new Promise(() => {}));

    render(<Hotels />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays a message when no hotels are found', async () => {
    // Override the mock for this specific test
    (fetchHotels as jest.Mock).mockResolvedValue({ hotels: [], totalPages: 0, currentPage: 1 });
    
    render(<Hotels />);

    // Use `findBy` to wait for the promise to resolve
    expect(await screen.findByText(/no hotels found/i)).toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });

  it('renders a list of hotels', () => {
    render(<Hotels />);

    const hotelCards = screen.getAllByRole('article');
    expect(hotelCards).toHaveLength(exampleHotels.length);
  });

  it('displays hotel information correctly', () => {
    render(<Hotels />);

    const firstHotel: Hotel = exampleHotels[0];
    expect(screen.getByText(firstHotel.name)).toBeInTheDocument();
    expect(screen.getByText(firstHotel.city)).toBeInTheDocument();
    expect(screen.getByText(`Rating: ${firstHotel.rating}`)).toBeInTheDocument();
    expect(screen.getByText(`₹${firstHotel.price} per night`)).toBeInTheDocument();
  });

  it('navigates to the hotel detail page on button click', () => {
    render(<Hotels />);

    const viewDetailsButtons = screen.getAllByRole('button', { name: /view details/i });
    fireEvent.click(viewDetailsButtons[0]);

    expect(mockRouter.push).toHaveBeenCalledWith(`/hotels/${hotels[0].id}`);
  });
});
