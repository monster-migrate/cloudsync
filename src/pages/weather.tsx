import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
  PreviewData,
} from "next";
import { ParsedUrlQuery } from "querystring";
import { WeatherDetailType } from "@/lib/types/WeatherDetailType";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { IoPartlySunny, IoSunnyOutline } from "react-icons/io5";
import { WiDayFog, WiMoonAltFirstQuarter } from "react-icons/wi";

import { Roboto_Condensed } from "next/font/google";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { AQIDetails } from "@/lib/types/AirQualityType";
import { classifyTrend } from "@/lib/classifyTrendData";
import { getWeatherDescription } from "@/lib/getWeatherType";
import { IoIosSunny } from "react-icons/io";
import WeatherIcon from "@/components/WeatherIcon/component";
import { FaWind } from "react-icons/fa";
import { LuRadiation } from "react-icons/lu";
import { GiSunrise, GiSunset } from "react-icons/gi";
const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: "300",
});

const WeatherPage: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [weatherData, setWeatherData] = useState(props.initialData);
  const [airQualityData, setAirQualityData] = useState(props.airQualityData);
  const [timestamp, setTimestamp] = useState("");
  const [sunsetCountdown, setSunsetCountdown] = useState("");
  const [sunriseCountdown, setSunriseCountdown] = useState("");
  const [location, setLocation] = useState(props.locationProps);
  const [error, setError] = useState(props.initialError);
  const formatTimeFromEpoch = (time: any): any => {
    const date = new Date(time * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    // Format to hh:mm:ss
    return [
      String(hours).padStart(2, "0"),
      String(minutes).padStart(2, "0"),
      String(seconds).padStart(2, "0"),
    ].join(":");
  };
  function getWindDirection(angle: number): string {
    if (angle >= 337.5 || angle < 22.5) return "North";
    if (angle >= 22.5 && angle < 67.5) return "North East";
    if (angle >= 67.5 && angle < 112.5) return "East";
    if (angle >= 112.5 && angle < 157.5) return "South East";
    if (angle >= 157.5 && angle < 202.5) return "South";
    if (angle >= 202.5 && angle < 247.5) return "SouthWest";
    if (angle >= 247.5 && angle < 292.5) return "West";
    if (angle >= 292.5 && angle < 337.5) return "North West";
    return "Unknown direction";
  }
  useEffect(() => {
    setTimestamp(
      new Date(Date.now()).toLocaleString("en-IN", {
        timeZone: location.timezone,
        hour: "2-digit",
        minute: "2-digit",
        year: "numeric",
        month: "long",
        day: "2-digit",
        weekday: "long",
      })
    ); // Update the timestamp after the component has mounted
    const current_time = new Date(weatherData.current.time);
    const sunset_time = new Date(weatherData.daily.sunset[0]);
    const sunrise_time = new Date(weatherData.daily.sunrise[0]);
    const sunset_timeDiff = sunset_time.getTime() - current_time.getTime();
    const sunrise_timeDiff = sunrise_time.getTime() - current_time.getTime();
    const sunset_hours = Math.floor(sunset_timeDiff / (1000 * 60 * 60));
    const sunset_minutes = Math.floor(
      (sunset_timeDiff % (1000 * 60 * 60)) / (1000 * 60)
    );
    const sunrise_hours = Math.floor(sunrise_timeDiff / (1000 * 60 * 60));
    const sunrise_minutes = Math.floor(
      (sunrise_timeDiff % (1000 * 60 * 60)) / (1000 * 60)
    );
    setSunsetCountdown(`${sunset_hours} hours and ${sunset_minutes} minutes`);
    setSunriseCountdown(
      `${sunrise_hours} hours and ${sunrise_minutes} minutes`
    );
  }, []);
  return (
    <div
      className={cn(
        `p-2 h-screen-minus-logo text-white flex flex-col justify-start items-center`,
        robotoCondensed.className
      )}
      style={{
        textShadow: "1px 1px 2px rgba(0,0,0,0.4)",
      }}
    >
      <div className="w-screen-minus-offset p-2 flex justify-center">
        <p>
          {location.location},&nbsp; {location.country}
          <br />
          {timestamp}
        </p>
        <div>
          {weatherData.current.is_day ? (
            <IoSunnyOutline size={40} />
          ) : (
            <WiMoonAltFirstQuarter size={40} />
          )}
        </div>
      </div>
      <div
        className={cn(
          `w-screen-minus-offset p-2 flex flex-col justify-start items-start`,
          `sm:flex-row sm:items-center sm:gap-4`
        )}
      >
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
          PM <sub>2.5</sub> : {airQualityData.current.pm2_5} μg/m³
        </p>
        <div className="flex flex-col justify-end items-end">
          <p className="text-4xl">
            {getWeatherDescription(weatherData.current.weather_code)}
          </p>
          <div className="flex flex-col justify-start items-start">
            <p className="text-gray-200 text-xs">Temperature</p>
            <br />
            <div className="flex justify-start items-center gap-4">
              <p className="text-4xl">
                <span className="text-8xl">
                  {weatherData.current.temperature_2m}°
                </span>
                C
              </p>
              <div>
                <WeatherIcon weatherCode={weatherData.current.weather_code} />
              </div>
            </div>
            <br />
            <p className="text-gray-200 text-xs">
              Feels Like <br />
              <span className="text-4xl text-white">
                {weatherData.current.apparent_temperature}°C
              </span>
            </p>
            <p>
              max/min
              <br />
              <span>
                {weatherData.daily.temperature_2m_max[0]} °C /{" "}
                {weatherData.daily.temperature_2m_min[0]} °C
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-start items-start">
          <div className="flex justify-start items-center gap-4">
            <FaWind size={40} />
            <p>
              Wind is blowing at {weatherData.current.wind_speed_10m} km/h
              towards {getWindDirection(weatherData.current.wind_direction_10m)}
            </p>
          </div>
          <div className="flex justify-start items-center gap-4">
            <LuRadiation size={40} />
            <p>
              UV Index is at {weatherData.daily.uv_index_max[0]} and is{" "}
              {classifyTrend(
                weatherData.daily.uv_index_max,
                weatherData.daily.uv_index_max[0]
              )}
            </p>
          </div>
          <div className="flex justify-start items-center gap-4">
            {weatherData.current.is_day?<GiSunset size={40} />:
            <GiSunrise size={40} />}
            <p>
              {weatherData.current.is_day ? sunsetCountdown : sunriseCountdown}{" "}
              till {weatherData.current.is_day ? "sunset." : "sunrise."}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) => {
  const { lat, lon, loc, pop, country, timezone } = context.query;
  let initialData: WeatherDetailType | null = null;
  let airQualityData: AQIDetails | null = null;
  let initialError: string | null = null;
  if (lat && lon) {
    try {
      const weather_response = await fetch(
        `http://localhost:3000/api/weather/weatherdetail?lat=${lat}&lon=${lon}`
      );
      const data = await weather_response.json();
      if (weather_response.ok) {
        initialData = data;
      } else {
        initialError = data.error;
      }
    } catch (err) {
      initialError = "Failed to fetch data.";
    }
    try {
      const airquality_response = await fetch(
        `http://localhost:3000/api/airquality/aqi?lat=${lat}&lon=${lon}`
      );
      const air_data = await airquality_response.json();
      if (airquality_response.ok) {
        airQualityData = air_data;
      } else {
        initialError = air_data.error;
      }
    } catch (err) {
      initialError = "Failed to fetch data.";
    }
  } else {
    initialError = "Latitude and longitude are required.";
  }
  const locationProps = {
    location: loc || "",
    population: pop || "",
    country: country || "",
    timezone: timezone || "",
  };
  return {
    props: { initialData, airQualityData, initialError, locationProps },
  };
};

export default WeatherPage;
