import { LocationResponseType } from "./types/LocationType";

export async function fetchLocationData(
  query: string
): Promise<LocationResponseType | { error: string }> {
  const queryParams = new URLSearchParams({
    name: query,
  });

  const baseUrl = process.env.LOCATION_API_BASE_URL;
  const url = `${baseUrl}?${queryParams}`;
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(url, {
      signal: controller.signal,
      cache: "force-cache",
    });
    clearTimeout(timeout);
    const responseTime = Date.now() - start;
    console.log(`API response time: ${responseTime}ms`);

    if (!response.ok) {
      if (response.status >= 400 && response.status < 500) {
        console.error(
          `Client error: ${response.statusText}, Status Code: ${response.status}`
        );
        return { error: `Client error: ${response.statusText}` };
      } else if (response.status >= 500) {
        console.error(
          `Server error: ${response.statusText}, Status Code: ${response.status}`
        );
        return { error: `Server error: ${response.statusText}` };
      } else {
        console.error(
          `Unexpected error: ${response.statusText}, Status Code: ${response.status}`
        );
        return { error: `Unexpected error: ${response.statusText}` };
      }
    }

    const data = (await response.json()) as LocationResponseType;
    // console.log(`API response data: ${JSON.stringify(data)}`);
    return data;
  } catch (err: any) {
    const responseTime = Date.now() - start;
    console.error(
      `Error fetching location data: ${err}, Response time: ${responseTime}ms`
    );
    if (err.name === "AbortError") {
      return { error: "Request timed out." };
    } else if (err.name === "FetchError") {
      return { error: "Network error or invalid response." };
    } else {
      return { error: "Internal Server Error." };
    }
  }
}
