## Tarea Recuperación de datos en el servidor
## Asignación 2.11.
## 2.11: Paso 6 de la guía telefónica

http://localhost:3001/persons

```
main.jsx:
import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
    const [persons, setPersons] = useState([])

    useEffect(() => {
    axios.get('http://localhost:3001/persons')
        .then(response => {
        setPersons(response.data)
        })
        .catch(error => {
        console.error('Error al recuperar datos:', error)
        })
    }, [])

    return (
    <div>
        <h2>Phonebook</h2>
        <ul>
        {persons.map(p => (
            <li key={p.id}>{p.name} {p.number}</li>
        ))}
        </ul>
    </div>
    )
}

export default App
```

Ó:

```
import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  // Recuperar datos iniciales
  useEffect(() => {
    axios.get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
      .catch(error => {
        console.error('Error al recuperar datos:', error)
      })
  }, [])

  // Manejar envío del formulario
  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber
    }

    axios.post('http://localhost:3001/persons', newPerson)
      .then(response => {
        setPersons(persons.concat(response.data)) // actualizar lista
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        console.error('Error al agregar persona:', error)
      })
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
          number: <input 
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
          <li key={p.id}>{p.name} {p.number}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
```

🔑 Qué hace este código
useEffect: carga la lista inicial desde db.json (servidor en puerto 3001).

Formulario: permite ingresar nombre y número.

axios.post: envía la nueva persona al servidor JSON.

setPersons: actualiza el estado para que la lista se muestre inmediatamente en pantalla.


## Tarea Edición de datos en el servidor
## Asignaciones 2.12.-2.15.
## 2.12: Paso 7 de la guía telefónica

```
import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  // Recuperar datos iniciales del servidor
  useEffect(() => {
    axios.get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  // Añadir persona y sincronizar con servidor
  const addPerson = (event) => {
    event.preventDefault()

    const newPerson = {
      name: newName,
      number: newNumber
    }

    axios.post('http://localhost:3001/persons', newPerson)
      .then(response => {
        // response.data es el objeto con id asignado por el servidor
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        console.error('Error al guardar en servidor:', error)
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <ul>
        {persons.map(p => (
          <li key={p.id}>{p.name} {p.number}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
```

🔑 Claves del cambio
axios.post('http://localhost:3001/persons', newPerson) envía el nuevo contacto al servidor.

El servidor devuelve el objeto con su id generado.

Usamos setPersons(persons.concat(response.data)) para actualizar el estado con el objeto real del servidor.

Así, la lista queda sincronizada: si refrescas la página, los datos siguen ahí porque están guardados en db.json.


## Tarea 2.13: Paso 8 de la guía telefónica

src/services/persons.js:
```
import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    return axios.get(baseUrl).then(response => response.data)
}

const create = (newPerson) => {
    return axios.post(baseUrl, newPerson).then(response => response.data)
}

const update = (id, updatedPerson) => {
    return axios.put(`${baseUrl}/${id}`, updatedPerson).then(response => response.data)
}

const remove = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, create, update, remove }
```

App.jsx:
```
import { useState, useEffect } from 'react'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = { name: newName, number: newNumber }

    personService.create(newPerson).then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
    })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <ul>
        {persons.map(p => (
          <li key={p.id}>{p.name} {p.number}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
```

🔑 Ventajas de este cambio
Tu componente App queda más limpio, solo maneja estado y UI.

Toda la lógica de red está centralizada en services/persons.js.

Si mañana cambias la URL base o agregas más operaciones, solo modificas el servicio.


## Tarea 2.14: Paso 9 de la guía telefónica

persons.js:
```
import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => axios.get(baseUrl).then(res => res.data)
const create = newPerson => axios.post(baseUrl, newPerson).then(res => res.data)
const update = (id, updatedPerson) => axios.put(`${baseUrl}/${id}`, updatedPerson).then(res => res.data)
const remove = id => axios.delete(`${baseUrl}/${id}`)

export default { getAll, create, update, remove }
```

App.jsx:
```
import { useState, useEffect } from 'react'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = { name: newName, number: newNumber }

    personService.create(newPerson).then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
    })
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`¿Eliminar a ${name}?`)) {
      personService.remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(error => {
          console.error('Error al eliminar:', error)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <ul>
        {persons.map(p => (
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

🔍 Qué está pasando
Al presionar el botón delete, se ejecuta window.confirm.

Si el usuario elige OK, se llama a personService.remove(id) y se actualiza el estado filtrando la persona eliminada.

Si elige Cancel, no se hace nada.

Tu interfaz y el diálogo que muestra el navegador son exactamente lo que pide el ejercicio: confirmación antes de eliminar y sincronización con el servidor.



Luego se realizó una modificación:
🔑 Cambios que hice:

Eliminé el <ul> duplicado.

Cerré correctamente el return con </div> y luego la función App.

Dejé export default App fuera del componente.

Con esto tu aplicación ya compila sin errores y cumple con el paso 2.14: mostrar la lista, añadir contactos y eliminarlos con confirmación.


Debo volver al localhost:3000:

** Se abre en la terminal (en paralelo) con: npx json-server --watch db.json --port 3001 
Endpoints:
http://localhost:3001/persons

y la otra ventana: npm run dev  
Se visualiza http://localhost:5173/

## Tarea 2.15*: Paso 10 de la guía telefónica
services/persons.js:

```
import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => axios.get(baseUrl).then(res => res.data)
const create = newPerson => axios.post(baseUrl, newPerson).then(res => res.data)
const remove = id => axios.delete(`${baseUrl}/${id}`)

const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject).then(res => res.data)
}

export default { getAll, create, remove, update }

```

App.jsx:
```
import { useState, useEffect } from 'react'
import personService from './services/persons' 

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  // 1. Cargar datos iniciales
  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  // 2. Lógica de filtrado reactiva
  const personsToShow = filter === ''
    ? persons
    : persons.filter(person => 
        person.name.toLowerCase().includes(filter.toLowerCase())
      )

  // 3. Función principal para añadir o actualizar
  const addPerson = (event) => {
    event.preventDefault()
    
    // Verificamos si ya existe (usando minúsculas para mayor seguridad)
    const existingPerson = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())

    if (existingPerson) {
      const confirmMessage = `${newName} is already added to phonebook, replace the old number with a new one?`
      
      if (window.confirm(confirmMessage)) {
        const changedPerson = { ...existingPerson, number: newNumber }

        personService
          .update(existingPerson.id, changedPerson)
          .then(returnedPerson => {
            // Reemplazamos en el estado local solo a la persona que cambió
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            alert(`Error: '${existingPerson.name}' was already removed from server`)
            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
    } else {
      // Si es nuevo, usamos POST (create)
      const personObject = { name: newName, number: newNumber }
      
      personService.create(personObject).then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
    }
  }

  // 4. Función para eliminar
  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
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
      
      <div>
        filter shown with: <input 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)} 
        />
      </div>

      <h3>add a new</h3>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
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

