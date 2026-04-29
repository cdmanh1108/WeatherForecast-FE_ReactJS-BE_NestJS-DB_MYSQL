import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DailyForecast as DailyForecastType } from "../../types/weather";
import { useLanguage } from "../../context/LanguageContext";
import {
  formatDayOfWeek,
  formatTemperature,
  formatPercentage,
  formatWindSpeed,
} from "../../utils/formatters";
import { Droplets, Umbrella, Wind } from "lucide-react";
import { WeatherIcon } from "./WeatherIcon";

interface DailyForecastProps {
  data: DailyForecastType[];
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ data }) => {
  const { t, language } = useLanguage();

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>{t("dashboard.dailyForecast")}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-7">
          {data.map((day) => (
            <div
              key={day.date}
              className="rounded-2xl border bg-muted/40 p-4 transition hover:-translate-y-1 hover:bg-muted/70 hover:shadow-md"
            >
              <p className="text-center text-sm font-semibold">
                {formatDayOfWeek(day.date, language)}
              </p>

              <div className="my-3 flex justify-center">
                <WeatherIcon
                  icon={day.condition.icon}
                  description={day.condition.description}
                  size="lg"
                />
              </div>

              <div className="flex justify-center gap-2">
                <span className="text-lg font-bold">
                  {formatTemperature(day.maxTemp)}
                </span>
                <span className="text-lg text-muted-foreground">
                  {formatTemperature(day.minTemp)}
                </span>
              </div>

              <p className="mt-2 min-h-10 text-center text-xs text-muted-foreground capitalize">
                {day.summary || day.condition.description}
              </p>

              <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Droplets className="h-3.5 w-3.5" />
                    Hum
                  </span>
                  <span>{formatPercentage(day.humidity)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Wind className="h-3.5 w-3.5" />
                    Wind
                  </span>
                  <span>{formatWindSpeed(day.windSpeed)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Umbrella className="h-3.5 w-3.5" />
                    Rain
                  </span>
                  <span>{formatPercentage(Math.round(day.pop * 100))}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
