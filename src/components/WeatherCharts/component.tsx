import { cn } from "@/lib/utils";
import { Roboto_Condensed } from "next/font/google";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: "300",
});


const WeatherGraph = ({
  weatherCode,
  data,
  timezone,
}: {
  weatherCode: number;
  data: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  timezone: string;
}) => {
  const getGraphConfig = () => {
    if ([0, 1, 2, 3].includes(weatherCode)) {
      return {
        title: "Direct Solar Radiation and UV Index",
        keys: ["direct_radiation", "uv_index"],
        colors: ["#ffcc00", "#ff9900"],
      };
    }
    if ([45, 48].includes(weatherCode)) {
      return {
        title: "Visibility",
        keys: ["visibility"],
        colors: ["#66ccff"],
      };
    }
    if (
      [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)
    ) {
      return {
        title: "Rainfall & Showers",
        keys: ["rain", "showers"],
        colors: ["#0099ff", "#0066cc"],
      };
    }
    if ([71, 73, 75, 85, 86].includes(weatherCode)) {
      return {
        title: "Snowfall & Snow Depth",
        keys: ["snowfall", "snow_depth"],
        colors: ["#ffffff", "#cccccc"],
      };
    }
    if ([95, 96, 99].includes(weatherCode)) {
      return {
        title: "Wind Speed & Wind Gusts",
        keys: ["wind_speed_120m", "wind_gusts_10m"],
        colors: ["#ff4500", "#cc3300"],
      };
    }
    return null;
  };

  const transformHourlyData = (
    hourlyData: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    keys: string[],
    timezone: string
  ) => {
    return hourlyData.time.map((t: string, index: number) => {
      const date = new Date(t + "Z");
      const localTime = new Intl.DateTimeFormat("en-IN", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);

      const transformed: any = { time: localTime }; // eslint-disable-line @typescript-eslint/no-explicit-any
      keys.forEach((key) => {
        transformed[key] = hourlyData[key][index];
      });

      return transformed;
    });
  };

  const graphConfig = getGraphConfig();
  if (!graphConfig) return null;
  const formattedData = transformHourlyData(data, graphConfig.keys, timezone);
  return (
    <div className="p-4 rounded-lg bg-transparent w-screen-minus-offset">
      <h2
        className={cn(
          `text-lg font-semibold text-white mb-4`,
          robotoCondensed.className
        )}
      >
        {graphConfig.title}
      </h2>

      {graphConfig.keys.map((key, index) => (
        <div key={key} className="mb-6">
          <h3 className="text-md font-medium text-gray-300">{key}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="white" />
              <XAxis dataKey="time" stroke="#ffffff" />
              <YAxis stroke="#ffffff" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  color: "#fff",
                  borderRadius: "12px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={key}
                stroke={graphConfig.colors[index]}
                strokeWidth={2}
                dot={{ r: 4, fill: graphConfig.colors[index] }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};

export default WeatherGraph;
