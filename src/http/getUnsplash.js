import myAxios from "./unsplashAxios"
const apiKey = process.env.NEXT_PUBLIC_UNSPLASH_API_KEY

export const getImage = async (city) => {
  const response = await myAxios.get(
    `/search/photos?query=${city}&client_id=${apiKey}`
  )
  return response.data
}
