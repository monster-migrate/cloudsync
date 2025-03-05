import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
  PreviewData,
} from "next";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import { IoSunnyOutline } from "react-icons/io5";
import { WiBarometer, WiHumidity, WiMoonAltFirstQuarter } from "react-icons/wi";
import { Roboto_Condensed } from "next/font/google";
import { cn } from "@/lib/utils";
import WeatherIcon from "@/components/WeatherIcon/component";
import { FaCloud, FaWind } from "react-icons/fa";
import { LuRadiation } from "react-icons/lu";
import { GiSunrise, GiSunset } from "react-icons/gi";
import { classifyTrend } from "@/lib/classifyTrendData";
import { getWeatherDescription } from "@/lib/getWeatherType";
import WeatherGraph from "@/components/WeatherCharts/component";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: "300",
});

const WeatherPage: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { initialData, airQualityData, locationProps, initialError } = props;

  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [parsedTimestamp, setParsedTimestamp] = useState<Date | null>(null);
  const [sunsetCountdown, setSunsetCountdown] = useState<string | null>(null);
  const [sunriseCountdown, setSunriseCountdown] = useState<string | null>(null);

  function getWindDirection(angle: number): string {
    const directions = [
      "North",
      "North East",
      "East",
      "South East",
      "South",
      "SouthWest",
      "West",
      "North West",
    ];
    return directions[Math.round(angle / 45) % 8] || "Unknown direction";
  }

  useEffect(() => {
    if (!initialData || !locationProps) return;

    // Client-side timestamp to fix hydration mismatch
    setTimestamp(
      new Date().toLocaleString("en-IN", {
        timeZone: locationProps.timezone,
        hour: "2-digit",
        minute: "2-digit",
        year: "numeric",
        month: "long",
        day: "2-digit",
        weekday: "long",
      })
    );
    const parsedDate = new Date();
    const timeZoneOffset = new Date().getTimezoneOffset(); // Local system offset in minutes
    const formatter = new Intl.DateTimeFormat("en-IN", {
      timeZone: locationProps.timezone,
      timeZoneName: "short",
    });
    const parts = formatter.formatToParts(parsedDate);
    const timeZonePart = parts.find((part) => part.type === "timeZoneName");

    if (timeZonePart) {
      // Extract timezone offset in hours (e.g., "GMT+5:30" -> 5.5 hours)
      const match = timeZonePart.value.match(/GMT([+-]\d+):?(\d+)?/);
      if (match) {
        const hours = parseInt(match[1], 10);
        const minutes = match[2] ? parseInt(match[2], 10) : 0;
        const targetOffsetMinutes = hours * 60 + minutes;
        const adjustedDate = new Date(
          parsedDate.getTime() + (targetOffsetMinutes - timeZoneOffset) * 60000
        );
        setParsedTimestamp(adjustedDate);
      }
    }
    // Calculate sunset/sunrise countdown
    const current_time = new Date(initialData.current.time);
    const sunset_time = new Date(initialData.daily.sunset[0]);
    const sunrise_time = new Date(initialData.daily.sunrise[0]);

    const formatCountdown = (diff: number) => {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours} hours and ${minutes} minutes`;
    };

    setSunsetCountdown(
      formatCountdown(sunset_time.getTime() - current_time.getTime())
    );
    setSunriseCountdown(
      formatCountdown(sunrise_time.getTime() - current_time.getTime())
    );
  }, [initialData, locationProps]);

  if (initialError) {
    return <div className="text-red-500 p-4">{initialError}</div>;
  }

  return (
    <div
      className={cn(
        `p-2 h-screen-minus-logo max-h-auto overflow-auto text-white flex flex-col justify-start items-center`,
        robotoCondensed.className
      )}
      style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.4)" }}
    >
      <div className="w-screen-minus-offset p-2 flex justify-center">
        <p>
          {locationProps.location}, {locationProps.country}
          <br />
          {timestamp || "Loading time..."}
        </p>
        <div>
          {initialData.current.is_day ? (
            <IoSunnyOutline size={40} />
          ) : (
            <WiMoonAltFirstQuarter size={40} />
          )}
        </div>
      </div>

      <div className="w-screen-minus-offset p-2 flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <p>
          AQI: {airQualityData.current.us_aqi} and is{" "}
          {classifyTrend(
            airQualityData.hourly.pm2_5,
            airQualityData.current.pm2_5
          )}
          <br />
          Dust: {airQualityData.current.dust} μg/m³ and is{" "}
          {classifyTrend(
            airQualityData.hourly.dust,
            airQualityData.current.dust
          )}
          <br />
          PM <sub>2.5</sub>: {airQualityData.current.pm2_5} μg/m³
        </p>

        <div className="flex flex-col items-start">
          <p className="text-4xl">
            {getWeatherDescription(initialData.current.weather_code)}
          </p>
          <br />
          <div className="flex flex-col sm:flex-row justify-start items-center gap-4">
            <div className="flex items-center justify-center">
              <div>
                <WeatherIcon
                  weatherCode={initialData.current.weather_code}
                  is_day={initialData.current.is_day}
                  size={100}
                />
              </div>
              <p className="text-4xl">
                <span className="text-sm">Temperature</span>
                <br />
                <span className="text-8xl">
                  {initialData.current.temperature_2m}°
                </span>
                C
              </p>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-4">
                <FaWind size={40} />
                <p>
                  Wind is blowing at {initialData.current.wind_speed_10m} km/h
                  towards{" "}
                  {getWindDirection(initialData.current.wind_direction_10m)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <LuRadiation size={40} />
                <p>
                  UV Index is at {initialData.daily.uv_index_max[0]} and is{" "}
                  {classifyTrend(
                    initialData.daily.uv_index_max,
                    initialData.daily.uv_index_max[0]
                  )}
                </p>
              </div>
              <div className="flex items-center gap-4">
                {initialData.current.is_day ? (
                  <GiSunset size={40} />
                ) : (
                  <GiSunrise size={40} />
                )}
                <p>
                  {initialData.current.is_day
                    ? sunsetCountdown
                    : sunriseCountdown}{" "}
                  till {initialData.current.is_day ? "sunset" : "sunrise"}.
                </p>
              </div>
            </div>
          </div>
          <br />
          <div className="flex flex-row justify-center items-center gap-4 w-full">
            <p className="text-gray-100 text-sm">
              <span>
                Feels Like <br />
                <span className="text-md text-white">
                  {initialData.current.apparent_temperature}°C
                </span>
              </span>
            </p>
            {/* <hr className="border-1 h-[40px] border-gray-300" /> */}
            <p>
              <span>
                max/min:
                <br />
                <span className="text-md ">
                  {initialData.daily.temperature_2m_max[0]}°C /{" "}
                  {initialData.daily.temperature_2m_min[0]}°C
                </span>
              </span>
            </p>
            <div className="flex flex-col justify-center items-center">
              <FaCloud size={32} />
              <p className="text-[8px] sm:text-xs">Cloud Cover</p>
              {initialData.current.cloud_cover}
            </div>
            <div className="flex flex-col justify-center items-center">
              <WiHumidity size={32} />
              <p className="text-[8px] sm:text-xs">Humidity</p>
              {initialData.current.relative_humidity_2m}
            </div>
            <div className="flex flex-col justify-center items-center">
              <WiBarometer size={32} />
              <p className="text-[8px] sm:text-xs">Pressure</p>
              {initialData.current.pressure_msl}
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 8 }).map((_, i) => {
          const totalHours = initialData.hourly.time.length;
          const currentTime = parsedTimestamp || new Date();
          const currentIndex = initialData.hourly.time.findIndex(
            (t: string) => new Date(t).getHours() >= currentTime.getHours()
          );
          const validIndex = currentIndex === -1 ? 0 : currentIndex;
          const nextIndex = (validIndex + i) % totalHours;

          return (
            <div key={i}>
              <p>{initialData.hourly.temperature_2m[nextIndex]} °C</p>
              <WeatherIcon
                is_day={initialData.current.is_day}
                weatherCode={initialData.hourly.weather_code[nextIndex]}
                size={32}
              />
              <p>
                {new Date(
                  initialData.hourly.time[nextIndex]
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          );
        })}
      </div>
      <div>
        <WeatherGraph
          weatherCode={initialData.current.weather_code}
          data={initialData.hourly}
          timezone={locationProps.timezone}
        />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) => {
  const { lat, lon, loc, pop, country, timezone } = context.query;

  if (!lat || !lon) {
    return { props: { initialError: "Latitude and longitude are required." } };
  }

  try {
    const [weatherResponse, airQualityResponse] = await Promise.all([
      fetch(
        `${process.env.DEPLOYMENT_URL_BASE}/api/weather/weatherdetail?lat=${lat}&lon=${lon}`
      ).then((res) => res.json()),
      fetch(
        `${process.env.DEPLOYMENT_URL_BASE}/api/airquality/aqi?lat=${lat}&lon=${lon}`
      ).then((res) => res.json()),
    ]);

    return {
      props: {
        initialData: weatherResponse,
        airQualityData: airQualityResponse,
        locationProps: {
          location: loc || "",
          population: pop || "",
          country: country || "",
          timezone: timezone || "",
        },
      },
    };
  } catch {
    return { props: { initialError: "Failed to fetch data." } };
  }
};

export default WeatherPage;
