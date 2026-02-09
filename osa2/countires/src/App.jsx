import { useState, useEffect } from 'react'
import getCountries from './services/countries'
import Countries from './components/Countries'


const App = () => {
  const [countries, setCountries] = useState([]) 
  const [filter, setFilter] = useState('')

  useEffect(()=> {
      getCountries()
      .then(countries => {
        setCountries(countries)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const countriesToShow =countries.filter(country=>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  const showCountry = (name) => {
  setFilter(name)
}

  return (
    <div>
        <div>
          Find countries: <input value={filter} onChange={handleFilterChange} />
        </div>
        <Countries countries={countriesToShow}
        onShow={showCountry} />
    </div>
  )

}


export default App