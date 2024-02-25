import axios from "axios"

const myAxios = axios.create({
	baseURL: "http://api.openweathermap.org"
})

export default myAxios