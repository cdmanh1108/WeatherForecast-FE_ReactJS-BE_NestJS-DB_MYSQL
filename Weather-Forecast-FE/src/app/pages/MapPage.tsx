import React, { useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { MapPin, LocateFixed } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "../components/common/Navbar";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Loading } from "../components/common/Loading";
import { CurrentWeather } from "../components/weather/CurrentWeather";
import { HourlyForecast } from "../components/weather/HourlyForecast";
import { DailyForecast } from "../components/weather/DailyForecast";
import { WeatherHistory } from "../components/weather/WeatherHistory";
import { weatherService } from "../services/api/weather/weather.service";
import { WeatherData } from "../types/weather";
import { useLanguage } from "../context/LanguageContext";

interface MapClickHandlerProps {
  onSelectLocation: (lat: number, lon: number) => void;
}

const MapClickHandler: React.FC<MapClickHandlerProps> = ({
  onSelectLocation,
}) => {
  useMapEvents({
    click(event) {
      onSelectLocation(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
};

export const MapPage: React.FC = () => {
  const { t } = useLanguage();

  const defaultCenter: LatLngExpression = [10.7769, 106.7009];

  const [selectedPosition, setSelectedPosition] =
    useState<LatLngExpression | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWeatherByCoordinates = async (lat: number, lon: number) => {
    setSelectedPosition([lat, lon]);
    setIsLoading(true);

    try {
      const data = await weatherService.getWeatherByCoordinates(lat, lon);
      setWeatherData(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch weather for this location");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Your browser does not support geolocation");
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await fetchWeatherByCoordinates(
          position.coords.latitude,
          position.coords.longitude,
        );
      },
      () => {
        toast.error("Location permission denied");
        setIsLoading(false);
      },
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto space-y-6 px-4 py-8">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Weather Map</h1>
            <p className="mt-1 text-muted-foreground">
              Click anywhere on the map to view weather for that location.
            </p>
          </div>

          <Button onClick={handleUseMyLocation} disabled={isLoading}>
            <LocateFixed className="mr-2 h-4 w-4" />
            Use my location
          </Button>
        </section>

        <Card className="overflow-hidden shadow-sm">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Select location
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <div className="h-[480px] w-full">
              <MapContainer
                center={defaultCenter}
                zoom={11}
                scrollWheelZoom
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapClickHandler onSelectLocation={fetchWeatherByCoordinates} />

                {selectedPosition && (
                  <Marker position={selectedPosition}>
                    <Popup>Selected location</Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <Loading message={t("common.loading")} />
        ) : weatherData ? (
          <section className="space-y-6">
            <CurrentWeather
              data={weatherData.current}
              cityName={weatherData.city}
              country={weatherData.country}
            />

            <HourlyForecast data={weatherData.hourly} />

            <DailyForecast data={weatherData.daily} />

            <WeatherHistory data={weatherData.history} />
          </section>
        ) : (
          <Card className="border-dashed bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center px-6 py-14 text-center">
              <MapPin className="mb-4 h-14 w-14 text-muted-foreground" />
              <h2 className="text-xl font-semibold">No location selected</h2>
              <p className="mt-2 text-muted-foreground">
                Click on the map or use your current location to load weather
                data.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};
