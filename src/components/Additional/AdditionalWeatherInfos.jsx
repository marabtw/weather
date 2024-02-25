import React from "react"
import AdditionalWeatherInfo from "./AdditionalWeatherInfo"

import { FaTemperatureEmpty, FaWind } from "react-icons/fa6"
import { BsDroplet, BsEye } from "react-icons/bs"

const AdditionalWeatherInfos = React.memo(({ weatherData }) => {
  const check = (index) => {
    switch (index) {
      case 0:
        return {
          info: "Feels Like",
          value: `${weatherData?.main.feels_like}°`,
          text: "The temperature you actually feel",
          icon: <FaTemperatureEmpty className="text-[1.2rem] mb-[5px]" />,
        }
      case 1:
        return {
          info: "Humidity",
          value: `${weatherData?.main.humidity}%`,
          text: `The dew point is ${weatherData?.rain ? weatherData?.rain["1h"] : 0}° right now`,
          icon: <BsDroplet className="text-[1.2rem] mb-[5px]" />,
        }
      case 2:
        return {
          info: "Wind Speed",
          value: `${weatherData?.wind.speed} m/s`,
          text: "Air movement velocity.",
          icon: <FaWind className="text-[1.2rem] mb-[5px]" />,
        }
      case 3:
        return {
          info: "Visibility",
          value: `${weatherData?.visibility}m/s`,
          text: "The distance you can see clearly.",
          icon: <BsEye className="text-[1.2rem] mb-[5px]" />,
        }
      default:
        return {
          info: "error",
          value: "not found",
          text: "error",
          icon: "error",
        }
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <h2 className="text-[1.7rem] mb-[20px] font-semibold">
        Today's Highlights
      </h2>
      <div className="grid grid-cols-2 grid-rows-2 gap-[15px] flex-1">
        {Array.from({ length: 4 }, (_, i) => {
          const additionalWeatherInfo = check(i)
          return (
            <AdditionalWeatherInfo
              key={i + "feels"}
              index={i}
              {...additionalWeatherInfo}
            />
          )
        })}
      </div>
    </div>
  )
})

export default AdditionalWeatherInfos
