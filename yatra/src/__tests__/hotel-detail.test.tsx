
import { render, screen, fireEvent } from '@testing-library/react';
import HotelDetail from '@/pages/hotels/[id]';
import { useRouter } from 'next/router';
import { fetchHotelById } from '@/lib/api';
import hotels from '@/data/hotels.json';
import { Hotel } from '@/types';

// Mocking external dependencies, eg. APIs and router
jest.mock('@/lib/api');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Hotel Detail Page', () => {
  const mockRouter = {
    route: '/hotels/[id]',
    pathname: '/hotels/[id]',
    query: { id: 'hotel-1' },
    asPath: '/hotels/hotel-1',
    isReady: true,
    push: jest.fn(),
  };

  const exampleHotel = hotels.find(h => h.id === 'hotel-1') as Hotel;

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (fetchHotelById as jest.Mock).mockResolvedValue(exampleHotel);
  });

  it('displays a "not found" message for an invalid hotel id', async () => {
    (fetchHotelById as jest.Mock).mockResolvedValue(null);
    (useRouter as jest.Mock).mockReturnValue({
      ...mockRouter,
      query: { id: 'invalid-id' },
    });
    
    render(<HotelDetail />);

    expect(await screen.findByText(/hotel not found/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /book now/i })).not.toBeInTheDocument();
  });

  it('renders hotel details correctly, including facilities', async () => {
    render(<HotelDetail />);

    expect(await screen.findByRole('heading', { name: exampleHotel.name })).toBeInTheDocument();
    expect(screen.getByText(`₹${exampleHotel.price}`)).toBeInTheDocument();
    expect(screen.getByText(exampleHotel.city)).toBeInTheDocument();
    expect(screen.getByText(`Rating: ${exampleHotel.rating} / 5`)).toBeInTheDocument();
    expect(screen.getByText(exampleHotel.description)).toBeInTheDocument();

    // Check for facilities
    for (const facility of exampleHotel.facilities) {
      expect(screen.getByText(facility)).toBeInTheDocument();
    }
  });

  it('shows a booking confirmation alert on button click', async () => {
    window.alert = jest.fn();
    render(<HotelDetail />);

    const bookNowButton = await screen.findByRole('button', { name: /book now/i });
    fireEvent.click(bookNowButton);

    expect(window.alert).toHaveBeenCalledWith(`Booking initiated for ${exampleHotel.name}!`);
  });
});
