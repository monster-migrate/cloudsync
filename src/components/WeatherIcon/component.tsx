import { IoIosSunny } from "react-icons/io";
import { IoPartlySunny } from "react-icons/io5";
import { WiDayFog, WiRain, WiSnow, WiThunderstorm } from "react-icons/wi";

const WeatherIcon = ({ weatherCode }: { weatherCode: number }) => {
  return (
    <>
      {weatherCode === 0 && <IoIosSunny size={100} />}
      {[1, 2, 3].includes(weatherCode) && <IoPartlySunny size={100} />}
      {[45, 48].includes(weatherCode) && <WiDayFog size={100} />}
      {[51, 53, 55].includes(weatherCode) && <WiRain size={100} />}
      {[56, 57].includes(weatherCode) && <WiRain size={100} />}
      {[61, 63, 65].includes(weatherCode) && <WiRain size={100} />}
      {[66, 67].includes(weatherCode) && <WiRain size={100} />}
      {[71, 73, 75].includes(weatherCode) && <WiSnow size={100} />}
      {weatherCode === 77 && <WiSnow size={100} />}
      {[80, 81, 82].includes(weatherCode) && <WiRain size={100} />}
      {[85, 86].includes(weatherCode) && <WiSnow size={100} />}
      {weatherCode === 95 && <WiThunderstorm size={100} />}
      {[96, 99].includes(weatherCode) && <WiThunderstorm size={100} />}
    </>
  );
};

export default WeatherIcon;
