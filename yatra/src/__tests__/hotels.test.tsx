
import { render, screen, fireEvent, within } from '@testing-library/react';
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
    isReady: true,
    query: { city: exampleCity, checkin: '2025-07-20', checkout: '2025-07-22', guests: '2' },
    asPath: `/hotels?city=${exampleCity}&checkin=2025-07-20&checkout=2025-07-22&guests=2`,
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (fetchHotels as jest.Mock).mockResolvedValue(exampleHotels);
  });

  it('displays a loading indicator while fetching hotels', async () => {
    (useRouter as jest.Mock).mockReturnValue({ ...mockRouter, isReady: false });
    render(<Hotels />);
    expect(screen.getByText(/loading hotels.../i)).toBeInTheDocument();
  });

  it('displays a message when no hotels are found', async () => {
    (fetchHotels as jest.Mock).mockResolvedValue([]);
    
    render(<Hotels />);

    expect(await screen.findByText(/no hotels found/i)).toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });

  it('renders a list of hotels', async () => {
    render(<Hotels />);

    const hotelCards = await screen.findAllByRole('article');;
    expect(hotelCards).toHaveLength(exampleHotels.length);
  });

  it('displays hotel information correctly', async () => {
    render(<Hotels />);

    const firstHotel: Hotel = exampleHotels[0];
    const hotelCards = await screen.findAllByRole('article');
    const firstCard = hotelCards[0];
    
    expect(within(firstCard).getByText(firstHotel.name)).toBeInTheDocument();
    expect(within(firstCard).getByText(firstHotel.city)).toBeInTheDocument();
    expect(within(firstCard).getByText(`Rating: ${firstHotel.rating}`)).toBeInTheDocument();
    expect(within(firstCard).getByText(`₹${firstHotel.price} per night`)).toBeInTheDocument();
  });

  it('navigates to the hotel detail page on button click', async () => {
    render(<Hotels />);

    const viewDetailsButtons = await screen.findAllByRole('button', { name: /view details/i });
    expect(viewDetailsButtons[0]).toHaveAttribute('href', `/hotels/${exampleHotels[0].id}`);
  });
});
