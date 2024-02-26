"use client"
import React, { useEffect, useState } from "react"
import { GrLocation } from "react-icons/gr"
import { getImage } from "@/http/getUnsplash"

import SearchCity from "./SearchCity"

const MainWeather = React.memo(({ weatherData, updateWeatherData }) => {
  const [imageUrl, setImageUrl] = useState()

  // useEffect(() => {
  //   weatherData &&
  //     getImage(weatherData?.name)
  //       .then((data) => {
  //         setImageUrl(
  //           data.results[Math.floor(Math.random() * (data.results.length - 1))]
  //             .urls.raw
  //         )
  //       })
  //       .catch((error) => {
  //         console.log(error)
  //       })
  // }, [weatherData])

	useEffect(() =>{
		setImageUrl("https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?ixid=M3w1NzA1NzV8MHwxfHNlYXJjaHwyfHxQYXJpc3xlbnwwfHx8fDE3MDg4OTU2MDV8MA&ixlib=rb-4.0.3")
	},[weatherData])

  return (
    <div className="relative px-[50px] pt-[50px] pb-[25px] w-full">
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-[130px] h-[160px] rounded-tr-[30px] rounded-br-[30px] bg-[#818cf8] z-10">
        <div
          className="w-full h-[50%] flex flex-col justify-center items-center bg-[#4f46e5] rounded-br-[30px] rounded-tr-[30px] 
				before:absolute before:top-0 before:left-0 before:transform before:-translate-y-[100%] before:w-[30px] before:aspect-square before:bg-[#4f46e5]
				after:absolute after:top-0 after:left-0 after:transform after:-translate-y-[100%] after:w-[31px] after:aspect-square after:bg-[#090d26] after:rounded-bl-full
				"
        >
          <div
            style={
              weatherData?.weather?.[0]?.icon
                ? {
                    backgroundImage: `url(${`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`})`,
                  }
                : { backgroundImage: "url(/cloud.png)" }
            }
            className="h-[60%] aspect-square bg-cover bg-no-repeat bg-center"
          ></div>
          <p className="text-[1.1rem] leading-[.7rem]">
            {weatherData?.weather?.[0]?.main}
          </p>
        </div>
        <div
          className=" w-full h-[50%] flex justify-center items-center bg-[#818cf8] rounded-br-[30px]
				before:absolute before:bottom-[0] before:left-0 before:transform before:-translate-y-[-100%] before:w-[31px] before:aspect-square before:bg-[#818cf8]
				after:absolute after:bottom-0 after:left-0 after:transform after:-translate-y-[-100%] after:w-[32px] after:aspect-square after:bg-[#090d26] after:rounded-tl-full
				"
        >
          <h5 className="relative text-[2rem] flex">
            {weatherData?.main.temp}
            <span className="block text-[1.2rem] relative top-0">°C</span>
          </h5>
        </div>
      </div>
      <div
        className="relative w-full h-[320px] rounded-[50px] overflow-hidden flex items-center pl-[100px] bg-cover bg-no-repeat bg-center"
        style={
          imageUrl
            ? { backgroundImage: `url(${imageUrl})` }
            : { backgroundColor: "#121736" }
        }
      >
        <div className="flex w-max gap-[10px]">
          <GrLocation className="text-[2rem]" />
          <div className="">
            <h1 className="text-[2rem] leading-[1.5rem]">
              {weatherData?.name}
            </h1>
            <p className="mt-[10px]">{weatherData?.sys.country}</p>
          </div>
        </div>
        <SearchCity updateWeatherData={updateWeatherData} />
      </div>
    </div>
  )
})

export default MainWeather
