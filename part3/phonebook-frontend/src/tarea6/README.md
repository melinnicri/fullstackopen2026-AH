
## Tarea Datos de país 2,18*, paso 1

```
import { useState, useEffect } from 'react'
import axios from 'axios'

// 1. Definimos los componentes de apoyo FUERA de App (Nota 2 de tu tarea)
const CountryDetail = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital[0]}</div>
      <div>area {country.area}</div>

      <h3>languages:</h3>
      <ul>
        {/* Usamos Object.values porque languages es un objeto */}
        {Object.values(country.languages).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img 
        src={country.flags.png} 
        alt={`Flag of ${country.name.common}`} 
        width="150" 
      />
    </div>
  )
}

const App = () => {
  // 2. Estados SIEMPRE dentro de App
  const [countries, setCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  // 3. Efecto para cargar los datos al inicio
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  // 4. Lógica de filtrado (se recalcula en cada render)
  const countriesToShow = countries.filter(c => 
    c.name.common.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  return (
    <div>
      <div>
        find countries <input value={searchTerm} onChange={handleSearch} />
      </div>

      {/* 5. Lógica de los 3 escenarios */}
      {searchTerm === '' ? (
        <p>Start typing to search for a country</p>
      ) : countriesToShow.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : countriesToShow.length === 1 ? (
        <CountryDetail country={countriesToShow[0]} />
      ) : (
        <ul>
          {countriesToShow.map(c => (
            <li key={c.name.common}>{c.name.common}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
```

## Tarea 2.19*: Información del país, Paso 2

```
import { useState, useEffect } from 'react'
import axios from 'axios'

// --- COMPONENTES DE APOYO (FUERA DE APP) ---

const CountryDetail = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital[0]}</div>
      <div>area {country.area}</div>

      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      
      <img 
        src={country.flags.png} 
        alt={`Flag of ${country.name.common}`} 
        width="150" 
        style={{ border: '1px solid #ccc', marginTop: '10px' }}
      />
    </div>
  )
}

// --- COMPONENTE PRINCIPAL ---

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  // Carga inicial de todos los países
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  // Lógica de filtrado
  const countriesToShow = countries.filter(c => 
    c.name.common.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  return (
    <div>
      <div>
        find countries <input value={searchTerm} onChange={handleSearch} />
      </div>

      {/* Lógica de renderizado condicional */}
      {searchTerm === '' ? (
        <p>Start typing to search for a country</p>
      ) : countriesToShow.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : countriesToShow.length === 1 ? (
        <CountryDetail country={countriesToShow[0]} />
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {countriesToShow.map(c => (
            <li key={c.name.common} style={{ marginBottom: '5px' }}>
              {c.name.common} {' '}
              <button onClick={() => setSearchTerm(c.name.common)}>
                Show
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
```

## Tarea 2.20*: Información del país, STEP3

.env: VITE_SOME_KEY=clave que se entrega en la autorización de la cuenta

```
import { useState, useEffect } from 'react'
import axios from 'axios'

// 1. Componente de detalle con lógica de CLIMA
const CountryDetail = ({ country }) => {
  const [weather, setWeather] = useState(null)
  // Obtenemos la clave de las variables de entorno
  const api_key = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    const capital = country.capital[0]
    // Llamada a OpenWeatherMap
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => console.log('Error al obtener el clima', error))
  }, [country, api_key]) // Se ejecuta cada vez que el país cambia

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital[0]}</div>
      <div>area {country.area}</div>

      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      
      <img src={country.flags.png} alt="flag" width="150" />

      {/* Renderizado condicional del clima para evitar errores de null */}
      {weather ? (
        <div>
          <h2>Weather in {country.capital[0]}</h2>
          <p>temperature {weather.main.temp} Celsius</p>
          <img 
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
            alt="weather icon" 
          />
          <p>wind {weather.wind.speed} m/s</p>
        </div>
      ) : (
        <p>Loading weather...</p>
      )}
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const countriesToShow = countries.filter(c => 
    c.name.common.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div>
        find countries <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {searchTerm === '' ? (
        <p>Start typing to search for a country</p>
      ) : countriesToShow.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : countriesToShow.length === 1 ? (
        <CountryDetail country={countriesToShow[0]} />
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {countriesToShow.map(c => (
            <li key={c.name.common}>
              {c.name.common} {' '}
              <button onClick={() => setSearchTerm(c.name.common)}>Show</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
```