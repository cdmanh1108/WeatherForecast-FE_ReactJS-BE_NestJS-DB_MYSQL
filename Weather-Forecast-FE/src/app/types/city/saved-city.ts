import { City } from "./city";

export interface SavedCity extends City {
  savedAt: string;
  currentTemp?: number;
  condition?: string;
}
