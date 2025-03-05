import { WeatherDetailType } from "./types/WeatherDetailType";
// https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,pressure_msl,surface_pressure,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,visibility,evapotranspiration,et0_fao_evapotranspiration,vapour_pressure_deficit,wind_speed_10m,wind_speed_120m,wind_speed_180m,wind_direction_10m,wind_direction_120m,wind_direction_180m,wind_gusts_10m,soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_temperature_54cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,soil_moisture_9_to_27cm,soil_moisture_27_to_81cm,uv_index,uv_index_clear_sky,is_day,sunshine_duration,wet_bulb_temperature_2m,total_column_integrated_water_vapour,cape,lifted_index,convective_inhibition,freezing_level_height,boundary_layer_height,direct_radiation,terrestrial_radiation,direct_normal_irradiance_instant,global_tilted_irradiance_instant&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&forecast_hours=12&cell_selection=nearest
export async function fetchWeatherData(
  lat: number,
  lon: number
): Promise<WeatherDetailType | { error: string }> {
  const queryParams = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current:
      "temperature_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m,cloud_cover,relative_humidity_2m,pressure_msl",
    hourly:
      "temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,pressure_msl,surface_pressure,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,visibility,evapotranspiration,et0_fao_evapotranspiration,vapour_pressure_deficit,wind_speed_10m,wind_speed_120m,wind_speed_180m,wind_direction_10m,wind_direction_120m,wind_direction_180m,wind_gusts_10m,soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_temperature_54cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,soil_moisture_9_to_27cm,soil_moisture_27_to_81cm,uv_index,uv_index_clear_sky,is_day,sunshine_duration,wet_bulb_temperature_2m,total_column_integrated_water_vapour,cape,lifted_index,convective_inhibition,freezing_level_height,boundary_layer_height,direct_radiation,terrestrial_radiation,direct_normal_irradiance_instant,global_tilted_irradiance_instant,weather_code",
    daily:
      "uv_index_max,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant",
    forecast_hours: "24",
    cell_selection: "nearest",
  });

  const baseUrl = process.env.WEATHER_API_BASE_URL;
  const url = `${baseUrl}?${queryParams}`;
  const start = Date.now();
  // console.log(`Fetching weather data with URL: ${url}`);

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

    const data = (await response.json()) as WeatherDetailType;
    // console.log(`API response data: ${JSON.stringify(data)}`);
    return data;
  } catch (err: unknown) {
    const responseTime = Date.now() - start;
    console.error(
      `Error fetching location data: ${err}, Response time: ${responseTime}ms`
    );

    if (err instanceof Error) {
      if (err.name === "AbortError") {
        return { error: "Request timed out." };
      } else if (err.name === "FetchError") {
        return { error: "Network error or invalid response." };
      } else {
        return { error: "Internal Server Error." };
      }
    }

    // Handle non-Error cases (rare but possible)
    return { error: "An unknown error occurred." };
  }
}
