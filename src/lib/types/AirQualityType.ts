export type AQIDetails = {
  latitude: number;
  longitude: number;
  elevation: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  hourly: {
    time: string[];
    pm10: number[];
  };
  hourly_units: {
    pm10: string;
  };
};
