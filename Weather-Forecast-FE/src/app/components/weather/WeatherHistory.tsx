import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { WeatherHistory as WeatherHistoryType } from "../../types/weather";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Button } from "../ui/button";
import { formatHistoryDateTime } from "../../utils/formatters";

interface WeatherHistoryProps {
  data: WeatherHistoryType[];
}

const PAGE_SIZE = 8;

export const WeatherHistory: React.FC<WeatherHistoryProps> = ({ data }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [page, setPage] = useState(1);
  const xAxisTickColor = theme === "dark" ? "#ffffff" : "#111111";

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));

  const paginatedData = useMemo(() => {
    return data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }, [data, page]);

  const chartData = paginatedData.map((item) => ({
    time: formatHistoryDateTime(item.date),
    temperature: Math.round(item.temp),
    humidity: Math.round(item.humidity),
    pressure: Math.round(item.pressure),
  }));

  return (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="flex flex-col gap-3 border-b bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>{t("dashboard.weatherHistory")}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Showing {paginatedData.length} of {data.length} records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Prev
          </Button>

          <span className="min-w-12 text-center text-sm text-muted-foreground">
            {page}/{totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="mb-4 flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-2 rounded-full border bg-background px-3 py-1">
            <span className="h-3 w-3 rounded-full bg-orange-500" />
            <span>{t("dashboard.temperature")}</span>
          </div>

          <div className="flex items-center gap-2 rounded-full border bg-background px-3 py-1">
            <span className="h-3 w-3 rounded-full bg-sky-500" />
            <span>{t("dashboard.humidity")}</span>
          </div>
        </div>

        <div className="h-[360px] rounded-2xl border bg-gradient-to-b from-muted/30 to-background p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 16,
                right: 24,
                left: 0,
                bottom: 24,
              }}
            >
              <defs>
                <linearGradient
                  id="temperatureGradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>

                <linearGradient
                  id="humidityGradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="4 4"
                stroke="hsl(var(--border))"
                vertical={false}
              />

              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: xAxisTickColor }}
                angle={-20}
                textAnchor="end"
                height={60}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "#ffffff" }}
              />

              <Tooltip
                cursor={{
                  stroke: "hsl(var(--muted-foreground))",
                  strokeDasharray: "4 4",
                }}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "14px",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                }}
                labelStyle={{
                  color: "hsl(var(--foreground))",
                  fontWeight: 600,
                }}
              />

              <Legend verticalAlign="top" height={36} iconType="circle" />

              <Line
                type="monotone"
                dataKey="temperature"
                stroke="url(#temperatureGradient)"
                strokeWidth={4}
                dot={{
                  r: 4,
                  strokeWidth: 2,
                  fill: "hsl(var(--background))",
                  stroke: "#f97316",
                }}
                activeDot={{
                  r: 7,
                  strokeWidth: 3,
                  fill: "#f97316",
                  stroke: "hsl(var(--background))",
                }}
                name={`${t("dashboard.temperature")} (°C)`}
              />

              <Line
                type="monotone"
                dataKey="humidity"
                stroke="url(#humidityGradient)"
                strokeWidth={4}
                strokeDasharray="8 5"
                dot={{
                  r: 4,
                  strokeWidth: 2,
                  fill: "hsl(var(--background))",
                  stroke: "#38bdf8",
                }}
                activeDot={{
                  r: 7,
                  strokeWidth: 3,
                  fill: "#38bdf8",
                  stroke: "hsl(var(--background))",
                }}
                name={`${t("dashboard.humidity")} (%)`}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
