import { format, formatDistanceToNow } from "date-fns";
import { enUS, vi } from "date-fns/locale";

export const formatTemperature = (temp: number): string => {
  return `${Math.round(temp)}°C`;
};

export const formatWindSpeed = (speed: number): string => {
  return `${Math.round(speed)} km/h`;
};

export const formatPressure = (pressure: number): string => {
  return `${pressure} mb`;
};

export const formatVisibility = (visibility: number): string => {
  return `${(visibility / 1000).toFixed(1)} km`;
};

export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

export const formatDateTime = (
  date: string | Date | undefined,
  locale: string = "en",
): string => {
  if (!date) return "Unknown";
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "Invalid date";
    return format(dateObj, "PPp", { locale: locale === "vi" ? vi : enUS });
  } catch (error) {
    return "Invalid date";
  }
};

export const formatDate = (
  date: string | Date | undefined,
  locale: string = "en",
): string => {
  if (!date) return "Unknown";
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "Invalid date";
    return format(dateObj, "PP", { locale: locale === "vi" ? vi : enUS });
  } catch (error) {
    return "Invalid date";
  }
};

export const formatTime = (date: string | Date | undefined): string => {
  if (!date) return "Unknown";
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "Invalid time";
    return format(dateObj, "HH:mm");
  } catch (error) {
    return "Invalid time";
  }
};

export const formatRelativeTime = (
  date: string | Date | undefined,
  locale: string = "en",
): string => {
  if (!date) return "Unknown";
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "Invalid date";
    return formatDistanceToNow(dateObj, {
      addSuffix: true,
      locale: locale === "vi" ? vi : enUS,
    });
  } catch (error) {
    return "Invalid date";
  }
};

export const formatDayOfWeek = (
  date: string | Date | undefined,
  locale: string = "en",
): string => {
  if (!date) return "Unknown";
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "Invalid date";
    return format(dateObj, "EEEE", { locale: locale === "vi" ? vi : enUS });
  } catch (error) {
    return "Invalid date";
  }
};

export const getWeatherIconName = (condition: string): string => {
  const iconMap: Record<string, string> = {
    Clear: "Sun",
    Clouds: "Cloud",
    Rain: "CloudRain",
    Drizzle: "CloudDrizzle",
    Thunderstorm: "CloudLightning",
    Snow: "CloudSnow",
    Mist: "CloudFog",
    Fog: "CloudFog",
    Haze: "CloudFog",
  };

  return iconMap[condition] || "Cloud";
};

export const formatHistoryDateTime = (
  date: string | Date | undefined,
): string => {
  if (!date) return "Unknown";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) return "Invalid date";

    return format(dateObj, "dd/MM HH:mm");
  } catch (error) {
    return "Invalid date";
  }
};
