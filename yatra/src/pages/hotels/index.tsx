import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchHotels } from "@/lib/api";
import { Hotel } from "@/types";
import Link from "next/link";

export default function HotelList() {
  const router = useRouter();
  const { city, checkin, checkout, guests } = router.query;

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const loadHotels = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const searchParams = {
          city: city as string,
          checkin: checkin as string,
          checkout: checkout as string,
          guests: guests as string,
        };
        const fetchedHotels = await fetchHotels(searchParams);
        setHotels(fetchedHotels);
      } catch (err) {
        console.error("Failed to fetch hotels:", err);
        setError("An error occurred while fetching hotels.");
      } finally {
        setIsLoading(false);
      }
    };

    loadHotels();
  }, [router.isReady, city, checkin, checkout, guests]);
  
  if (isLoading) {
    return (
      <main className="flex items-center justify-center py-8 mx-auto max-w-maxwidth min-h-page-height">
        <p className="text-lg text-gray-500">Loading hotels...</p>
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

  return (
    <main className="px-4 py-8 mx-auto max-w-maxwidth min-h-page-height md:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center">
          Hotels { city ? (<span className="text-primary">{city}</span>) : null }
        </h1>
        {checkin && checkout && (
          <p className="mt-2 text-center text-gray-500">
            {`Showing results for ${checkin} to ${checkout}`}
          </p>
        )}
      </div>

      {hotels.length > 0 ? (
        <div className="space-y-6">
          {hotels.map((hotel) => (
            <article
              key={hotel.id}
              className="flex flex-col p-6 transition-shadow duration-300 border border-gray-200 rounded-lg shadow-md md:flex-row dark:border-gray-800 hover:shadow-xl bg-background"
            >
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-primary">{hotel.name}</h3>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  {hotel.city}
                </p>
                <p className="my-2 text-gray-800 dark:text-gray-200">
                  <span className="font-semibold text-yellow-500">⭐</span>{" "}
                  Rating: {hotel.rating}
                </p>
                <div className="flex flex-wrap gap-2 my-4">
                  {hotel.facilities.map((facility) => (
                    <span
                      key={facility}
                      className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-start justify-between pt-4 mt-4 border-t md:border-0 md:pt-0 md:mt-0 md:items-end md:w-1/4 md:pl-6">
                <p className="mb-4 text-xl font-semibold text-right text-gray-900 md:mb-0 dark:text-white">
                  ₹{hotel.price} per night
                </p>
                <Link
                  href={`/hotels/${hotel.id}`}
                  role="button"
                  className="w-full mt-auto text-center my-button md:w-auto"
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <h2 className="text-2xl font-semibold">No hotels found</h2>
          <p className="mt-2 text-gray-500">
            We couldn&apos;t find any hotels for your search. Please try
            different criteria.
          </p>
        </div>
      )}
    </main>
  );
}