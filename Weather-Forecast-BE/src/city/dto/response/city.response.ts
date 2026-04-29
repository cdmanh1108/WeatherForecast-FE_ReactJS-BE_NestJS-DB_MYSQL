export type CitySuggestionResponse = {
  city_id: number;
  city_name: string;
  country_name: string;
};

export type CityDetailResponse = CitySuggestionResponse & {
  latitude: number;
  longitude: number;
};
