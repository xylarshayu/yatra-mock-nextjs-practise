import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

import { fetchHotelById } from '@/lib/api';
import { type Hotel } from '@/types';

export default function Hotel() {
  const router = useRouter();
  const { id } = router.query;

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady || !id) {
      return;
    }

    const loadHotelDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedHotel = await fetchHotelById(id as string);
        if (fetchedHotel) {
          setHotel(fetchedHotel);
        } else {
          setHotel(null);
        }
      } catch (err) {
        console.error('Failed to fetch hotel details:', err);
        setError('An error occurred while fetching hotel details.');
      } finally {
        setIsLoading(false);
      }
    };

    loadHotelDetails();
  }, [router.isReady, id]);

  const handleBookNow = () => {
    if (hotel) {
      alert(`Booking initiated for ${hotel.name}!`);
    }
  };

  if (isLoading) {
    return (
      <main className="flex items-center justify-center py-8 mx-auto max-w-maxwidth min-h-page-height">
        <p className="text-lg text-gray-500">Loading hotel details...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex items-center justify-center py-8 mx-auto max-w-maxwidth min-h-page-height">
        <p className="text-lg text-red-500">{error}</p>
      </main>
    );
  }

  if (!hotel) {
    return (
      <main className="py-20 mx-auto text-center max-w-maxwidth min-h-page-height">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Hotel Not Found</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          We couldn&apos;t find a hotel with the specified ID.
        </p>
        <Link href="/" className="inline-block mt-8 text-lg my-button">
          ← Back to Search
        </Link>
      </main>
    );
  }

  return (
    <main className="px-4 py-8 mx-auto max-w-maxwidth min-h-page-height md:px-8">
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-xl md:p-10 dark:bg-gray-900 dark:border-gray-800">
        <div className="flex flex-col items-start justify-between pb-4 mb-6 border-b md:flex-row md:items-center dark:border-gray-700">
          <div>
            <h1 className="text-4xl font-bold text-primary">{hotel.name}</h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{hotel.city}</p>
          </div>
          <div className="mt-4 text-lg font-semibold text-gray-800 md:mt-0 dark:text-gray-200">
            <span className="text-yellow-500">⭐</span> Rating: {hotel.rating} / 5
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold">Description</h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">{hotel.description}</p>
            
            <h2 className="mt-8 text-2xl font-semibold">Facilities</h2>
            <div className="flex flex-wrap gap-3 mt-4">
              {hotel.facilities.map((facility) => (
                <span
                  key={facility}
                  className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200"
                >
                  {facility}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <p className="text-3xl font-bold text-center text-gray-900 dark:text-white">
              ₹{hotel.price}
            </p>
            <p className="text-center text-gray-500 dark:text-gray-400">per night</p>
            <button
              onClick={handleBookNow}
              className="w-full mt-6 text-lg my-button"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}