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

import { IoSunnyOutline } from "react-icons/io5";
import { WiMoonAltFirstQuarter } from "react-icons/wi";

import { Roboto_Condensed } from "next/font/google";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { AQIDetails } from "@/lib/types/AirQualityType";
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
  useEffect(() => {
    setTimestamp(
      new Date(Date.now()).toLocaleString("en-GB", {
        timeZone: "Europe/Berlin",
        hour: "2-digit",
        minute: "2-digit",
        year: "numeric",
        month: "long",
        day: "2-digit",
        weekday: "long",
      })
    ); // Update the timestamp after the component has mounted
  }, []);
  return (
    <div
      className={cn(
        `p-2 h-screen-minus-logo text-white flex flex-col justify-center items-center`,
        robotoCondensed.className
      )}
    >
      <div className="w-screen-minus-offset p-2 flex justify-between">
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
      <div className="w-screen-minus-offset p-2 flex justify-between">
        AQI: {airQualityData.current.us_aqi}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) => {
  const { lat, lon, loc, pop, country } = context.query;
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
  };
  return {
    props: { initialData, airQualityData, initialError, locationProps },
  };
};

export default WeatherPage;
