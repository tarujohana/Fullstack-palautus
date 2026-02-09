import { useState, useEffect } from 'react'
import getWeather from '../services/weather'

const Country = ({ country }) => {
    const [weather, setWeather] = useState(null)

    useEffect(()=> {
        if (country.capital)
            getWeather(country.capital[0])
            .then(data => {
                setWeather(data)
            })
            .catch(error => {
                console.error('Weather fetch failed', error)
           })
      }, [country.capital])

    return(
  <div>
    <h2>{country.name.common}</h2>

    <p>Capital: {country.capital?.[0]}</p>
    <p>Area: {country.area}</p>

    <h3>Languages:</h3>
    <ul>
      {country.languages &&
        Object.values(country.languages).map(language =>
          <li key={language}>{language}</li>
        )}
    </ul>

    <img
      src={country.flags.png}
      alt={`Flag of ${country.name.common}`}
      width="150"
    />

    {weather && (
        <>
        <h3>Weather in {country.capital[0]}</h3>
        <p>Temperature: {weather.main.temp}°C</p>
        <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
        />
        <p>Wind: {weather.wind.speed} m/s</p>
        </>
    )}
  </div>
    )
}

const CountryList = ({ countries, onShow }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length > 1) {
    return (
      <ul>
        {countries.map(country =>
          <li key={country.cca3}>
            {country.name.common}
            <button onClick={() => onShow(country.name.common)}>show</button>
          </li>
        )}
      </ul>
    )
  }

  if (countries.length === 1) {
    return <Country country={countries[0]} />
  }

  return null
}

export default CountryList
