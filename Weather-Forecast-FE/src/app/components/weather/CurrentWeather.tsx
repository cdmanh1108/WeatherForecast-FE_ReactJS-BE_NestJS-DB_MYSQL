import React from "react";
import { Card, CardContent } from "../ui/card";
import { CurrentWeather as CurrentWeatherType } from "../../types/weather";
import { useLanguage } from "../../context/LanguageContext";
import {
  Thermometer,
  Droplets,
  Gauge,
  Wind,
  Sun,
  Eye,
  Cloud,
  MapPin,
  Activity,
} from "lucide-react";
import {
  formatTemperature,
  formatPercentage,
  formatPressure,
  formatWindSpeed,
  formatVisibility,
  formatRelativeTime,
} from "../../utils/formatters";
import { WeatherIcon } from "./WeatherIcon";

interface CurrentWeatherProps {
  data: CurrentWeatherType;
  cityName: string;
  country: string;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  data,
  cityName,
  country,
}) => {
  const { t, language } = useLanguage();

  const weatherDetails = [
    {
      icon: Thermometer,
      label: t("dashboard.feelsLike"),
      value: formatTemperature(data.feelsLike),
    },
    {
      icon: Droplets,
      label: t("dashboard.humidity"),
      value: formatPercentage(data.humidity),
    },
    {
      icon: Gauge,
      label: t("dashboard.pressure"),
      value: formatPressure(data.pressure),
    },
    {
      icon: Wind,
      label: t("dashboard.windSpeed"),
      value: formatWindSpeed(data.windSpeed),
    },
    {
      icon: Sun,
      label: t("dashboard.uvIndex"),
      value: Math.round(data.uvIndex).toString(),
    },
    {
      icon: Eye,
      label: t("dashboard.visibility"),
      value: formatVisibility(data.visibility),
    },
    {
      icon: Cloud,
      label: t("dashboard.cloudCoverage"),
      value: formatPercentage(data.cloudCoverage),
    },
    {
      icon: Activity,
      label: "AQI",
      value: data.aqi.toString(),
    },
  ];

  return (
    <Card className="overflow-hidden border-none bg-gradient-to-br from-primary/15 via-background to-muted shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {cityName}, {country}
              </span>
            </div>

            <h2 className="text-5xl font-bold tracking-tight">
              {formatTemperature(data.temp)}
            </h2>

            <p className="mt-2 text-lg font-medium capitalize">
              {data.condition.description}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {t("dashboard.lastUpdated")}:{" "}
              {formatRelativeTime(data.lastUpdated, language)}
            </p>
          </div>

          <WeatherIcon
            icon={data.condition.icon}
            description={data.condition.description}
            size="xl"
          />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {weatherDetails.map((detail) => {
            const Icon = detail.icon;

            return (
              <div
                key={detail.label}
                className="rounded-2xl border bg-background/70 p-4 shadow-sm backdrop-blur"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>

                <p className="text-xs text-muted-foreground">{detail.label}</p>
                <p className="mt-1 text-base font-semibold">{detail.value}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
