import axios from 'axios'

const getWeather = (capital)=>{
    const apiKey= import.meta.env.VITE_SOME_KEY
    const baseURL= `http://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=${capital}`
    return axios.get(baseURL).then(response => response.data)   
}

export default getWeather