import { WeatherData } from "../../../types/weather";

const unixToIso = (timestamp: string | number) => {
  return new Date(Number(timestamp) * 1000).toISOString();
};

const getMainFromIcon = (icon: string, description: string) => {
  const desc = description.toLowerCase();

  if (desc.includes("rain")) return "Rain";
  if (desc.includes("cloud")) return "Clouds";
  if (desc.includes("clear")) return "Clear";
  if (desc.includes("storm") || desc.includes("thunder")) return "Thunderstorm";
  if (desc.includes("snow")) return "Snow";
  if (desc.includes("drizzle")) return "Drizzle";
  if (desc.includes("fog") || desc.includes("mist")) return "Fog";

  if (icon.startsWith("01")) return "Clear";
  if (icon.startsWith("02") || icon.startsWith("03") || icon.startsWith("04"))
    return "Clouds";
  if (icon.startsWith("09") || icon.startsWith("10")) return "Rain";
  if (icon.startsWith("11")) return "Thunderstorm";
  if (icon.startsWith("13")) return "Snow";
  if (icon.startsWith("50")) return "Fog";

  return "Clouds";
};

export const mapWeatherResponse = (apiResponse: any): WeatherData => {
  const result = apiResponse.result;

  return {
    city: result.city,
    country: result.country,

    current: {
      temp: result.current.temperature,
      feelsLike: result.current.feels_like,
      pressure: result.current.pressure,
      humidity: result.current.humidity,
      cloudCoverage: result.current.clouds,
      visibility: result.current.visibility,
      windSpeed: result.current.wind_speed,
      uvIndex: result.current.uv,
      aqi: result.current.aqi,
      lastUpdated: unixToIso(result.current.cur_timestamp),
      condition: {
        main: getMainFromIcon(
          result.current.icon,
          result.current.weather_description,
        ),
        description: result.current.weather_description,
        icon: result.current.icon,
      },
    },

    hourly: result.hourly.map((item: any) => ({
      time: unixToIso(item.hf_timestamp),
      temp: item.temperature,
      feelsLike: item.feels_like,
      pressure: item.pressure,
      humidity: item.humidity,
      cloudCoverage: item.clouds,
      visibility: item.visibility,
      windSpeed: item.wind_speed,
      uvIndex: item.uv,
      aqi: item.aqi,
      pop: item.pop,
      condition: {
        main: getMainFromIcon(item.icon, item.weather_description),
        description: item.weather_description,
        icon: item.icon,
      },
    })),

    daily: result.daily.map((item: any) => ({
      date: unixToIso(item.df_date),
      maxTemp: item.temperature_max,
      minTemp: item.temperature_min,
      morningTemp: item.temperature_morn,
      dayTemp: item.temperature_day,
      eveningTemp: item.temperature_eve,
      nightTemp: item.temperature_night,
      feelsLikeDay: item.feels_like_day,
      pressure: item.pressure,
      humidity: item.humidity,
      windSpeed: item.wind_speed,
      cloudCoverage: item.clouds,
      uvIndex: item.uv,
      aqi: item.aqi,
      pop: item.pop,
      summary: item.summary,
      condition: {
        main: getMainFromIcon(item.icon, item.weather_description),
        description: item.weather_description,
        icon: item.icon,
      },
    })),

    history: result.history.map((item: any) => ({
      date: unixToIso(item.hw_timestamp),
      temp: item.temperature,
      minTemp: item.temperature_min,
      maxTemp: item.temperature_max,
      pressure: item.pressure,
      humidity: item.humidity,
      windSpeed: item.wind_speed,
      windDeg: item.wind_deg,
      cloudCoverage: item.clouds,
      condition: {
        main: getMainFromIcon(item.icon, item.weather_description),
        description: item.weather_description,
        icon: item.icon,
      },
    })),
  };
};
