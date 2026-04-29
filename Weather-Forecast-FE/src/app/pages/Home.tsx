import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { CloudSun, Moon, Sun, LogIn, Search, UserPlus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { CitySearch } from "../components/city/CitySearch";
import { CurrentWeather } from "../components/weather/CurrentWeather";
import { HourlyForecast } from "../components/weather/HourlyForecast";
import { DailyForecast } from "../components/weather/DailyForecast";
import { WeatherHistory } from "../components/weather/WeatherHistory";
import { Loading } from "../components/common/Loading";
import { City } from "../types/city";
import { WeatherData } from "../types/weather";
import { weatherService } from "../services/api/weather/weather.service";
import { useLanguage } from "../context/LanguageContext";
import { toast } from "sonner";
import { useTheme } from "../context/ThemeContext";
import { ConfirmDialog } from "../components/dialog/ConfirmDialog";
import { cityService } from "../services/api/city/city.service";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../utils/constants";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedCity, setDetectedCity] = useState<City | null>(null);
  const [isDetectedCityDialogOpen, setIsDetectedCityDialogOpen] =
    useState(false);

  const handleCitySelect = async (city: City) => {
    setIsLoading(true);

    try {
      const cityId = parseInt(city.id, 10);

      if (!Number.isFinite(cityId)) {
        toast.error("Invalid city ID");
        return;
      }

      const data = await weatherService.getWeatherByCity(cityId);

      setWeatherData(data);
    } catch (error) {
      console.error(error);
      toast.error(t("dashboard.errorFetching") || "Failed to fetch weather");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDetectedCity = async () => {
    if (!detectedCity) {
      return;
    }

    setIsDetectedCityDialogOpen(false);
    await handleCitySelect(detectedCity);
  };

  useEffect(() => {
    let isMounted = true;

    if (!navigator.geolocation) {
      return () => {
        isMounted = false;
      };
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const city = await cityService.getCityByCoordinates(
            position.coords.latitude,
            position.coords.longitude,
          );

          if (!isMounted) {
            return;
          }

          setDetectedCity(city);
          setIsDetectedCityDialogOpen(true);
        } catch (error) {
          console.error("Failed to detect city from current location", error);
        }
      },
      () => {
        // User denied geolocation or location is unavailable.
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <CloudSun className="h-6 w-6 text-primary" />
            <span>Weather Forecast</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {user ? (
              <>
                <Button asChild>
                  <Link to={ROUTES.DASHBOARD}>{t("nav.dashboard")}</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to={ROUTES.LOGIN}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>

                <Button asChild>
                  <Link to={ROUTES.REGISTER}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mx-auto mb-10 max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
            Real-time weather, hourly forecast, daily forecast and history
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Check weather anywhere
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground md:text-lg">
            Search any city to view current weather, hourly forecast, daily
            forecast, and weather history.
          </p>

          <div className="mx-auto mt-8 max-w-2xl">
            <CitySearch onSelectCity={handleCitySelect} />
          </div>
        </section>

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
          <Card className="mx-auto max-w-3xl border-dashed bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <Search className="mb-4 h-16 w-16 text-muted-foreground" />

              <h2 className="text-2xl font-semibold">
                Search a city to get started
              </h2>

              <p className="mt-2 max-w-md text-muted-foreground">
                Search for a city above to load weather information.
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <ConfirmDialog
        open={isDetectedCityDialogOpen}
        onOpenChange={setIsDetectedCityDialogOpen}
        title="Detected location"
        description={
          detectedCity
            ? `Seem like you are living in ${detectedCity.name}.`
            : "Seem like you are living in this city."
        }
        onConfirm={() => {
          void handleConfirmDetectedCity();
        }}
        confirmText="Right"
        cancelText="No"
      />
    </div>
  );
};
