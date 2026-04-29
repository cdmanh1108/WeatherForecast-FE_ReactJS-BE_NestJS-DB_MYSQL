import { City } from "../../../types/city";
import { CityByCoordinatesResponse, CitySuggestionResponse } from "./types";

export const mapCitySuggestionToCity = (
  item: CitySuggestionResponse,
): City => ({
  id: String(item.city_id),
  name: item.city_name,
  country: item.country_name,
  state: "",
  lat: 0,
  lon: 0,
});

export const mapCityByCoordinatesToCity = (
  item: CityByCoordinatesResponse,
): City => ({
  id: String(item.city_id),
  name: item.city_name,
  country: item.country_name,
  state: "",
  lat: item.latitude,
  lon: item.longitude,
});
