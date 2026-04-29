import React from "react";

interface WeatherIconProps {
  icon: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClass = {
  sm: "h-10 w-10",
  md: "h-14 w-14",
  lg: "h-20 w-20",
  xl: "h-28 w-28",
};

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  icon,
  description,
  size = "md",
}) => {
  return (
    <img
      src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
      alt={description || "Weather icon"}
      className={`${sizeClass[size]} object-contain drop-shadow-sm`}
    />
  );
};
