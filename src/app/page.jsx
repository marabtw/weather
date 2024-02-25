"use client"
import { useEffect, useState } from "react"
import { getCurrentWeatherData, getDailyWeatherData } from "@/http/gets"

import MainWeather from "@/components/Main/MainWeather"
import ForecastDays from "@/components/ForecastDays/ForecastDays"
import AdditionalWeatherInfos from "@/components/Additional/AdditionalWeatherInfos"

const HomePage = () => {
  const [coord, setCoord] = useState({
    lat: 48.8534,
    lon: 2.3488,
  })
  const [weatherData, setWeaherData] = useState()
  const [dailyData, setDailyData] = useState()

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      getCurrentWeatherData(coord.lat, coord.lon)
        .then((res) => {
          setWeaherData(res)
        })
        .catch((error) => {
          error
        })
      getDailyWeatherData(coord.lat, coord.lon)
        .then((res) => {
          setDailyData(res.list)
        })
        .catch((error) => {
          console.log(error)
        })
    }
    return () => {
      isMounted = false
    }
  }, [coord])

  const updateWeatherData = (lat, lon) => {
    setCoord({
      lat: lat,
      lon: lon,
    })
  }

  return (
    <div className="pb-[50px]">
      <MainWeather
        weatherData={weatherData}
        updateWeatherData={updateWeatherData}
      />
      <main className="flex gap-[50px] px-[50px]">
        <ForecastDays dailyData={dailyData} />
        <AdditionalWeatherInfos weatherData={weatherData} />
      </main>
    </div>
  )
}

export default HomePage
