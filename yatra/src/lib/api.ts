import hotels from "@/data/hotels.json";
import cities from "@/data/cities.json";
import { SearchHotelsParams } from "@/types";

// Async to simulate fetching data, even though it's all static
export async function fetchHotels(filters?: SearchHotelsParams) {
  return hotels.filter((hotel) => {
    return filters?.city ? hotel.city === filters.city : true;
  });
}

export async function fetchHotelById(id: string) {
  return hotels.find((h) => h.id === id);
}

export async function fetchCities() {
  return cities;
}
