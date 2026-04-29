import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { cityService } from "../../services/api/city/city.service";
import { City } from "../../types/city";
import { useLanguage } from "../../context/LanguageContext";

interface CitySearchProps {
  onSelectCity: (city: City) => void;
}

export const CitySearch: React.FC<CitySearchProps> = ({ onSelectCity }) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchCities = async () => {
      const normalizedQuery = query.trim();
      if (normalizedQuery.length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const cities = await cityService.searchCities(normalizedQuery);
        setResults(cities);
        setIsOpen(true);
      } catch (error) {
        console.error("Error searching cities:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchCities, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelectCity = (city: City) => {
    onSelectCity(city);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t("dashboard.searchCity")}
          className="pl-10 pr-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
          {results.map((city) => (
            <button
              key={city.id}
              onClick={() => handleSelectCity(city)}
              className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex flex-col gap-1"
            >
              <span className="font-medium">{city.name}</span>
              <span className="text-sm text-muted-foreground">
                {city.state ? `${city.state}, ` : ""}
                {city.country}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen &&
        !isLoading &&
        query.trim().length >= 2 &&
        results.length === 0 && (
          <div className="absolute z-50 w-full mt-2 bg-background border rounded-md shadow-lg p-4 text-center text-sm text-muted-foreground">
            No cities found
          </div>
        )}
    </div>
  );
};
