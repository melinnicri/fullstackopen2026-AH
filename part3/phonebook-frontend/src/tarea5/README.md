## Tarea Añadir estilos a una aplicación React

## Tarea 2.16: Paso 11 de la guía telefónica
// src/components/Notification.jsx:

```
const Notification = ({ message }) => {
    if (message === null) {
    return null
    }

    return (
    <div className="success">
        {message}
    </div>
    )
}

export default Notification
```

App.jsx:

```
import { useState, useEffect } from 'react'
import personService from './services/persons' 
import Notification from './components/Notification' // Asegúrate de importar el componente

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  // Función genérica para notificaciones
  const notify = (message) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const personsToShow = filter === ''
    ? persons
    : persons.filter(person => 
        person.name.toLowerCase().includes(filter.toLowerCase())
      )

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())

    if (existingPerson) {
      if (window.confirm(`${newName} is already added, replace the old number?`)) {
        const changedPerson = { ...existingPerson, number: newNumber }

        personService
          .update(existingPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
            setNewName('')
            setNewNumber('')
            notify(`Updated number for ${returnedPerson.name}`) // Notificación de actualización
          })
          .catch(error => {
            alert(`Error: '${existingPerson.name}' was already removed from server`)
            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
    } else {
      const personObject = { name: newName, number: newNumber }
      
      personService.create(personObject).then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        notify(`Added ${returnedPerson.name}`) // Notificación de creación
      })
    }
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          notify(`Deleted ${name} successfully`) // Notificación de eliminación
        })
        .catch(error => {
          alert(`The person '${name}' was already deleted from server`)
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      
      {/* Componente de notificación arriba */}
      <Notification message={notification} />

      <div>
        filter shown with: <input 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)} 
        />
      </div>

      <h3>add a new</h3>
      <form onSubmit={addPerson}>
        <div>name: <input value={newName} onChange={(e) => setNewName(e.target.value)} /></div>
        <div>number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} /></div>
        <div><button type="submit">add</button></div>
      </form>

      <h3>Numbers</h3>
      <ul>
        {personsToShow.map(p => (
          <li key={p.id}>
            {p.name} {p.number} 
            <button onClick={() => deletePerson(p.id, p.name)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
```

## Tarea 2.17*: Paso 12 de la guía telefónica
PUT http://localhost:3001/persons/10

💡 Qué significa el error
Código 404 → el recurso solicitado no se encuentra.

En este caso, el json-server busca /persons/10 y no lo halla en db.json.

Por eso Axios lanza la excepción “Request failed with status code 404”.

src/components/Notification.jsx:
```
const Notification = ({ message, type }) => {
  if (message === null) return null

  const notificationStyle = {
    color: type === 'error' ? 'red' : 'green',
    background: '#eee',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return <div style={notificationStyle}>{message}</div>
}

export default Notification
```

App.jsx:
```
import Notification from './components/Notification'

const [notificationMessage, setNotificationMessage] = useState(null)
const [notificationType, setNotificationType] = useState('')
```

```
<Notification message={notificationMessage} type={notificationType} />
```

```
personService
  .update(id, changedPerson)
  .then(returnedPerson => {
    setPersons(persons.map(p => p.id !== id ? p : returnedPerson))
    setNotificationMessage(`Updated ${changedPerson.name}'s number successfully`)
    setNotificationType('success')
    setTimeout(() => setNotificationMessage(null), 5000)
  })
  .catch(error => {
    setNotificationMessage(`Information of ${changedPerson.name} has already been removed from server`)
    setNotificationType('error')
    setPersons(persons.filter(p => p.id !== id))
    setTimeout(() => setNotificationMessage(null), 5000)
  })
```

💡 Resultado esperado
Si la operación funciona, aparece un mensaje verde durante unos segundos.

Si falla, aparece un mensaje rojo como el de tu imagen.

Ambos desaparecen automáticamente después de 5 segundos.
