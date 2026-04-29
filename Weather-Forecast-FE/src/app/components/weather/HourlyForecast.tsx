import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { HourlyForecast as HourlyForecastType } from "../../types/weather";
import { useLanguage } from "../../context/LanguageContext";
import {
  formatTime,
  formatTemperature,
  formatPercentage,
  formatWindSpeed,
} from "../../utils/formatters";
import { Droplets, Umbrella, Wind } from "lucide-react";
import { WeatherIcon } from "./WeatherIcon";

interface HourlyForecastProps {
  data: HourlyForecastType[];
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ data }) => {
  const { t } = useLanguage();

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>{t("dashboard.hourlyForecast")}</CardTitle>
      </CardHeader>

      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-4 pb-4">
            {data.map((hour) => (
              <div
                key={hour.time}
                className="min-w-[145px] rounded-2xl border bg-muted/40 p-4 transition hover:-translate-y-1 hover:bg-muted/70 hover:shadow-md"
              >
                <p className="text-center text-sm font-semibold">
                  {formatTime(hour.time)}
                </p>

                <div className="my-3 flex justify-center">
                  <WeatherIcon
                    icon={hour.condition.icon}
                    description={hour.condition.description}
                    size="md"
                  />
                </div>

                <p className="text-center text-2xl font-bold">
                  {formatTemperature(hour.temp)}
                </p>

                <p className="mt-1 truncate text-center text-xs text-muted-foreground capitalize">
                  {hour.condition.description}
                </p>

                <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1">
                      <Droplets className="h-3.5 w-3.5" />
                      Hum
                    </span>
                    <span>{formatPercentage(hour.humidity)}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1">
                      <Wind className="h-3.5 w-3.5" />
                      Wind
                    </span>
                    <span>{formatWindSpeed(hour.windSpeed)}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1">
                      <Umbrella className="h-3.5 w-3.5" />
                      Rain
                    </span>
                    <span>{formatPercentage(Math.round(hour.pop * 100))}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
