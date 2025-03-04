import type { NextApiRequest, NextApiResponse } from "next";
import { fetchWeatherData } from "@/lib/fetchWeatherData";
import { WeatherDetailType } from "@/lib/types/WeatherDetailType";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WeatherDetailType | { error: string }>
): Promise<void> {
  const { lat, lon } = req.query as { lat: string; lon: string };
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  if (
    !lat ||
    !lon ||
    isNaN(latitude) ||
    isNaN(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return res.status(400).json({
      error: "<b>Invalid</b> or missing lat/lon parameters.",
    });
  }

  const result = await fetchWeatherData(latitude, longitude);
  if ("error" in result) {
    return res.status(500).json(result);
  }
  return res.status(200).json(result);
}
