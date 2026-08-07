## Tarea 2.6: Paso 1 de la guía telefónica

```
import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([{ name: 'Arto Hellas' }, 
                                          { name: 'Grace Hopper' }])
  const [newName, setNewName] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = { name: newName }
    setPersons(persons.concat(personObject))
    setNewName('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input 
            value={newName}
            onChange={(e) => setNewName(e.target.value)} 
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <ul>
        {persons.map(p => <li key={p.name}>{p.name}</li>)}
      </ul>

      {/* Aquí va el debug */}
      <div>debug: {newName}</div>
    </div>
  )
}

export default App
```

---

## 2.7: Paso 2 de la guía telefónica

```
import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' },
    { name: 'Grace Hopper' }
  ])
  const [newName, setNewName] = useState('')

  const addPerson = (event) => {
    event.preventDefault()

    // Verifica si el nombre ya existe
    if (persons.some(p => p.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const personObject = { name: newName }
    setPersons(persons.concat(personObject))
    setNewName('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name:{' '}
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <ul>
        {persons.map(p => (
          <li key={p.name}>{p.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
```

## 2.8: Paso 3 de la guía telefónica

```
import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Grace Hopper', number: '39-44-5323523' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.some(p => p.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const personObject = { 
      name: newName, 
      number: newNumber 
    }

    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name:{' '}
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <div>
          number:{' '}
          <input
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <ul>
        {persons.map(p => (
          <li key={p.name}>
            {p.name} {p.number}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
```

## 2.9*: Paso 4 de la guía telefónica

```
import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.some(p => p.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const personObject = { name: newName, number: newNumber }
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  const personsToShow = persons.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with:{' '}
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name:{' '}
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <div>
          number:{' '}
          <input
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <ul>
        {personsToShow.map(p => (
          <li key={p.name}>
            {p.name} {p.number}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
```

## 2.10: Paso 5 de la guía telefónica

Agregar src/tarea3/components/Filter.jsx:

```
const Filter = ({ filter, handleFilterChange }) => {
    return (
    <div>
    filter shown with:{' '}
    <input value={filter} onChange={handleFilterChange} />
    </div>
)
}

export default Filter
```

Agregar src/tarea3/components/PersonForm.jsx:

```
const PersonForm = ({
    addPerson,
    newName,
    handleNameChange,
    newNumber,
    handleNumberChange
}) => {
    return (
    <form onSubmit={addPerson}>
        <div>
        name:{' '}
        <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
        number:{' '}
        <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
        <button type="submit">add</button>
        </div>
    </form>
)
}

export default PersonForm
```

Agregar src/tarea3/components/Persons.jsx:

```
const Persons = ({ personsToShow }) => {
    return (
    <ul>
        {personsToShow.map(p => (
        <li key={p.name}>
            {p.name} {p.number}
        </li>
        ))}
    </ul>
)
}

export default Persons
```

Agregar en App.jsx:

```
import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(p => p.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    const personObject = { name: newName, number: newNumber }
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (e) => setNewName(e.target.value)
  const handleNumberChange = (e) => setNewNumber(e.target.value)
  const handleFilterChange = (e) => setFilter(e.target.value)

  const personsToShow = persons.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} />
    </div>
  )
}

export default App
```
