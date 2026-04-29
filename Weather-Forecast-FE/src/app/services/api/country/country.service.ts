import api from "../../api";
import { ApiResponse } from "../common/api-response";

const getAllCountries = async () => {
  const response = await api.get<ApiResponse<any[]>>("/country");

  if (response.data.result) {
    return response.data.result;
  }

  return [];
};

const getCountryById = async (id: string) => {
  const response = await api.get<ApiResponse<any>>(`/country/${id}`);

  if (response.data.result) {
    return response.data.result;
  }

  throw new Error("Country not found");
};

export const countryService = {
  getAllCountries,
  getCountryById,
};
