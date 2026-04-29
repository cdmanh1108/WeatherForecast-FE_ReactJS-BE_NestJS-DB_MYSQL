import { City } from "../../../types/city/city";
import api from "../../api";
import { ApiResponse } from "../common/api-response";
import { mapCityByCoordinatesToCity, mapCitySuggestionToCity } from "./mappers";
import {
  CityByCoordinatesResponse,
  CityByIdResponse,
  CitySuggestionResponse,
} from "./types";

const searchCities = async (keyword: string): Promise<City[]> => {
  const trimmedKeyword = keyword.trim();
  if (trimmedKeyword.length < 2) {
    return [];
  }

  const response = await api.get<ApiResponse<CitySuggestionResponse[]>>(
    "/city/suggest",
    {
      params: { keyword: trimmedKeyword },
    },
  );

  if (response.data.result) {
    return response.data.result.map(mapCitySuggestionToCity);
  }

  return [];
};

const getCityByCoordinates = async (
  latitude: number,
  longitude: number,
): Promise<City> => {
  const response = await api.get<ApiResponse<CityByCoordinatesResponse>>(
    "/city/by-coordinates",
    {
      params: { latitude, longitude },
    },
  );

  if (response.data.result) {
    return mapCityByCoordinatesToCity(response.data.result);
  }

  throw new Error("Failed to get city by coordinates");
};

const getCityById = async (cityId: number): Promise<City> => {
  const response = await api.get<ApiResponse<CityByIdResponse>>(`/city/${cityId}`);

  if (response.data.result) {
    return mapCityByCoordinatesToCity(response.data.result);
  }

  throw new Error("Failed to get city by id");
};

export const cityService = {
  searchCities,
  getCityByCoordinates,
  getCityById,
};
