export const STORAGE_KEYS = {
  AUTH_TOKEN: "weather_auth_token",
  USER_DATA: "weather_user_data",
  THEME: "weather_theme",
  LANGUAGE: "weather_language",
  SAVED_CITIES: "weather_saved_cities",
  ALERTS: "weather_alerts",
  NOTIFICATIONS: "weather_notifications",
  SEARCH_HISTORY: "weather_search_history",
} as const;

export const THEME = {
  LIGHT: "light",
  DARK: "dark",
} as const;

export const LANGUAGE = {
  EN: "en",
  VI: "vi",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  MAP: "/map",
} as const;
