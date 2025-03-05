import { IoIosSunny } from "react-icons/io";
import { IoPartlySunny } from "react-icons/io5";
import {
  WiDayFog,
  WiNightAltPartlyCloudy,
  WiNightAltRain,
  WiNightAltSnow,
  WiNightAltThunderstorm,
  WiNightClear,
  WiNightFog,
  WiRain,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";

const WeatherIcon = ({
  weatherCode,
  is_day,
  size,
}: {
  weatherCode: number;
  is_day: number;
  size: number;
}) => {
  return (
    <div>
      {weatherCode === 0 &&
        (is_day ? <IoIosSunny size={size} /> : <WiNightClear size={size} />)}
      {[1, 2, 3].includes(weatherCode) &&
        (is_day ? (
          <IoPartlySunny size={size} />
        ) : (
          <WiNightAltPartlyCloudy size={size} />
        ))}
      {[45, 48].includes(weatherCode) &&
        (is_day ? <WiDayFog size={size} /> : <WiNightFog size={size} />)}
      {[51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(
        weatherCode
      ) && (is_day ? <WiRain size={size} /> : <WiNightAltRain size={size} />)}
      {[71, 73, 75, 85, 86].includes(weatherCode) &&
        (is_day ? <WiSnow size={size} /> : <WiNightAltSnow size={size} />)}
      {[95, 96, 99].includes(weatherCode) &&
        (is_day ? (
          <WiThunderstorm size={size} />
        ) : (
          <WiNightAltThunderstorm size={size} />
        ))}
    </div>
  );
};

export default WeatherIcon;
