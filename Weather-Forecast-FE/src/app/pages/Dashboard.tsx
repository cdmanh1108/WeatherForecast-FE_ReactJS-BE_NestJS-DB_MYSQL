import React, { useCallback, useEffect, useState } from "react";
import { Navbar } from "../components/common/Navbar";
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
import { CloudOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/api/user/user.service";

export const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user, updateProfile } = useAuth();

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncingLocation, setIsSyncingLocation] = useState(false);
  const [hasAttemptedLocationSync, setHasAttemptedLocationSync] =
    useState(false);

  const fetchWeatherByCityId = useCallback(
    async (cityId: number) => {
      setIsLoading(true);

      try {
        const data = await weatherService.getWeatherByCity(cityId);
        setWeatherData(data);
      } catch (error) {
        toast.error(
          t("dashboard.errorFetching") || "Failed to fetch weather data",
        );
        console.error("Error fetching weather:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [t],
  );

  const handleCitySelect = async (city: City) => {
    try {
      const cityId = parseInt(city.id, 10);
      await fetchWeatherByCityId(cityId);
    } catch {
      // Error is handled in fetchWeatherByCityId
    }
  };

  const syncLocationThenFetchWeather = useCallback(async () => {
    if (!navigator.geolocation) {
      return;
    }

    setHasAttemptedLocationSync(true);
    setIsSyncingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const updatedProfile = await userService.updateCurrentCityByCoordinates(
            position.coords.latitude,
            position.coords.longitude,
          );

          if (updatedProfile.currentCityId) {
            if (updatedProfile.currentCityId !== user?.currentCityId) {
              updateProfile({
                currentCityId: updatedProfile.currentCityId,
                currentCity: updatedProfile.currentCity,
              });
            } else {
              await fetchWeatherByCityId(updatedProfile.currentCityId);
            }
          }
        } catch (error) {
          console.error("Error syncing location on dashboard:", error);
        } finally {
          setIsSyncingLocation(false);
        }
      },
      () => {
        setIsSyncingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  }, [fetchWeatherByCityId, updateProfile, user?.currentCityId]);

  useEffect(() => {
    const currentCityId = user?.currentCityId;
    if (!currentCityId || !Number.isFinite(currentCityId)) {
      return;
    }

    void fetchWeatherByCityId(currentCityId);
  }, [user?.currentCityId, fetchWeatherByCityId]);

  useEffect(() => {
    const currentCityId = user?.currentCityId;
    if (currentCityId || isSyncingLocation || hasAttemptedLocationSync) {
      return;
    }

    void syncLocationThenFetchWeather();
  }, [
    user?.currentCityId,
    isSyncingLocation,
    hasAttemptedLocationSync,
    syncLocationThenFetchWeather,
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <section className="mb-8 flex justify-center">
          <div className="w-full max-w-xl">
            <CitySearch onSelectCity={handleCitySelect} />
          </div>
        </section>

        {isLoading ? (
          <Loading message={t("common.loading")} />
        ) : weatherData ? (
          <div className="space-y-6">
            <CurrentWeather
              data={weatherData.current}
              cityName={weatherData.city}
              country={weatherData.country}
            />

            <div className="grid grid-cols-1 gap-6">
              <HourlyForecast data={weatherData.hourly} />
              <DailyForecast data={weatherData.daily} />
              <WeatherHistory data={weatherData.history} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed bg-muted/20 px-6 py-24 text-center">
            <CloudOff className="mb-4 h-20 w-20 text-muted-foreground" />

            <h3 className="mb-2 text-2xl font-semibold">
              {t("dashboard.selectCity")}
            </h3>

            <p className="max-w-md text-muted-foreground">
              Search for a city above to view current weather, forecasts, and
              weather history.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
