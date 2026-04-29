export type AlertConditionType =
  | "temp_above"
  | "temp_below"
  | "rain"
  | "snow"
  | "wind_above"
  | "humidity_above"
  | "humidity_below";

export interface AlertCondition {
  type: AlertConditionType;
  value?: number;
}
