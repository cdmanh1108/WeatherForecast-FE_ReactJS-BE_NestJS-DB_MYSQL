export interface CitySuggestionResponse {
  city_id: number;
  city_name: string;
  country_name: string;
}

export interface CityByCoordinatesResponse {
  city_id: number;
  city_name: string;
  country_name: string;
  latitude: number;
  longitude: number;
}

export type CityByIdResponse = CityByCoordinatesResponse;
