import type { NextApiRequest, NextApiResponse } from "next";
import { fetchAirQuality } from "@/lib/fetchAirQuality";
import { AQIDetails } from "@/lib/types/AirQualityType";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AQIDetails | { error: string }>
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

  const result = await fetchAirQuality(latitude, longitude);

  if ("error" in result) {
    return res.status(500).json(result);
  }

  return res.status(200).json(result);
}
