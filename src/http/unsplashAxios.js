import axios from "axios"

const myAxios = axios.create({
	baseURL: "https://api.unsplash.com"
})

export default myAxios