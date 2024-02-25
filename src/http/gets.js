import myAxios from "./axios"
const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY

export const getCurrentWeatherData = async (lat, lon) => {
  const response = await myAxios.get(
    `/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  )
  return response.data
}

export const getCities = async (hint) => {
  const response = await myAxios.get(
    `/data/2.5/find?q=${"" + hint}&units=metric&appid=${apiKey}`
  )
  return response.data
}

export const getDailyWeatherData = async (lat, lon) => {
  const response = await myAxios.get(
    `/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=3&units=metric&appid=${apiKey}`
  )
  return response.data
}
