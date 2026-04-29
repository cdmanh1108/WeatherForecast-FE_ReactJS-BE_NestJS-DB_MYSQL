import api from "../../api";
import { WeatherData } from "../../../types/weather";
import { mapWeatherResponse } from "./weather.mapper";
import { cityService } from "../city/city.service";

export const weatherService = {
  async getWeatherByCity(city_id: number): Promise<WeatherData> {
    const response = await api.get("/weather/full", {
      params: {
        city_id,
      },
    });

    return mapWeatherResponse(response.data);
  },

  async getWeatherByCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<WeatherData> {
    const city = await cityService.getCityByCoordinates(latitude, longitude);
    const cityId = parseInt(city.id, 10);

    if (!Number.isFinite(cityId)) {
      throw new Error("Invalid city ID from coordinates");
    }

    return this.getWeatherByCity(cityId);
  },
};
