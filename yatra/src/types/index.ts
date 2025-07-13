
export interface Hotel {
  id: string;
  name: string;
  city: string;
  rating: number;
  price: number;
  facilities: string[];
  description: string;
}

export type City = string;

export interface SearchHotelsParams {
  city: City;
  checkin: string;
  checkout: string;
  guests: string;
}

export type FormErrors = {
  [K in keyof SearchHotelsParams]?: string;
};