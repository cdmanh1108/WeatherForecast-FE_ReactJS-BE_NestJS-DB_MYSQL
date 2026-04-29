import { AlertCondition } from "./condition";

export interface WeatherAlert {
  id: string;
  userId: string;
  cityId: string;
  cityName: string;
  condition: AlertCondition;
  isActive: boolean;
  createdAt: string;
}
