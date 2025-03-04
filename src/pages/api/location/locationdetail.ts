import type { NextApiRequest, NextApiResponse } from "next";
import { fetchLocationData } from "@/lib/fetchLocation";
import { LocationResponseType } from "@/lib/types/LocationType";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LocationResponseType | { error: string }>
): Promise<void> {
  const { query } = req.query as { query: string };
  
  if (!query || query.trim().length === 0) {
    return res
      .status(400)
      .json({ error: "Invalid or missing query parameter." });
  }

  const result = await fetchLocationData(query);

  if ("error" in result) {
    return res.status(500).json(result);
  }

  return res.status(200).json(result);
}
