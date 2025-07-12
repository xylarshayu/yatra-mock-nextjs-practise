import hotels from '@/data/hotels.json';
import cities from '@/data/cities.json';

// Async to simulate fetching data, even though it's all static
export async function fetchHotels() {
  return hotels;
}

export async function fetchHotelById(id: string) {
  return hotels.find(h => h.id === id);
}

export async function fetchCities() {
  return cities;
}