## Tarea 3.19: Guía telefónica y base de datos, Paso 7

phonebook-frontend/App.jsx:

```
import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const personsToShow = filter === ''
    ? persons
    : persons.filter(person => 
        person.name.toLowerCase().includes(filter.toLowerCase())
      )

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmUpdate) {
        const changedPerson = { ...existingPerson, number: newNumber }
        
        axios
          .put(`http://localhost:3001/api/persons/${existingPerson.id}`, changedPerson)
          .then(response => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : response.data))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            const errorMsg = error.response.data.error 
              ? error.response.data.error 
              : `Error: ${newName} has already been removed from server`
            
            setErrorMessage(errorMsg)
            setTimeout(() => setErrorMessage(null), 5000)
          })
      }
    } else {
      const personObject = { name: newName, number: newNumber }
      
      axios
        .post('http://localhost:3001/api/persons', personObject)
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
          setErrorMessage(null)
        })
        .catch(error => {
        // En lugar de hacer .split(','), usa el mensaje tal cual viene
    const fullMessage = error.response.data.error;
    setErrorMessage(fullMessage); 
    setTimeout(() => setErrorMessage(null), 5000);
})
    }
  } // <--- Esta llave cierra addPerson

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`¿Delete ${person.name}?`)) {
      axios
        .delete(`http://localhost:3001/api/persons/${id}`)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(error => {
          alert('Este contacto ya fue eliminado del servidor')
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      {errorMessage && (
        <div className="error-notification">
          {errorMessage}
        </div>
      )}

      <div>
        filter shown with <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>

      <h3>add a new</h3>

      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
        </div>
        <button type="submit">add</button>
      </form>
      
      <h2>Numbers</h2>
      <ul>
        {personsToShow.map(person => 
          <li key={person.id}>
            {person.name} {person.number} {' '}
            <button onClick={() => deletePerson(person.id)}>Delete</button>
          </li>
        )}
      </ul>
    </div>
  )
} // <--- Esta llave cierra el componente App

export default App
```

phonebook-backend/index.js:

```
require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

// --- RUTAS ---

// GET: Información de la agenda
app.get('/info', (request, response, next) => {
    Person.countDocuments({})
        .then(count => {
            response.send(`
                <p>Phonebook has info for ${count} people</p>
                <p>${new Date()}</p>
            `)
        })
        .catch(error => next(error))
})

// GET ALL: Obtener todos
app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons)
    }).catch(error => next(error))
})

// GET individual: Obtener por ID
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

// POST: Crear nuevo
app.post('/api/persons', (request, response, next) => {
    const body = request.body
    
    // Dejamos que Mongoose maneje la validación de minLength y required
    const person = new Person({ 
        name: body.name, 
        number: body.number 
    })

    person.save()
        .then(saved => response.json(saved))
        .catch(error => next(error))
})

// DELETE: Eliminar
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(() => response.status(204).end())
        .catch(error => next(error))
})

// PUT: Actualizar
app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    Person.findByIdAndUpdate(
        request.params.id, 
        { name, number }, 
        { new: true, runValidators: true, context: 'query' }
    )
    .then(updated => response.json(updated))
    .catch(error => next(error))
})

// --- MANEJO DE ERRORES (Al final de todas las rutas) ---
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
    // Enviamos el mensaje generado por Mongoose al frontend
    return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
```

## Tarea 3.20*: Guía telefónica y base de datos, Paso 8
phonebook-backend/person.js:

```
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

// Usamos la variable de entorno que ya configuramos en tu .env
const url = process.env.MONGODB_URI

console.log('Conectando a', url)

mongoose.connect(url, { family: 4 }) // Mantenemos el fix de IPv4 para Tacna
    .then(result => {
    console.log('Conectado a MongoDB Atlas')
    })
    .catch((error) => {
    console.log('Error al conectar a MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
    type: String,
    minLength: 3,
    required: true
    },
    number: {
    type: String,
    minLength: 8, // Regla: Al menos 8 caracteres
    required: true,
    validate: {
        validator: function(v) {
        // Explicación de la Regex:
        // ^\d{2,3}      -> Empieza con 2 o 3 dígitos
        // -             -> Un guion obligatorio
        // \d+$          -> Sigue con uno o más dígitos hasta el final
        return /^\d{2,3}-\d+$/.test(v);
        },
        message: props => `${props.value} no es un formato de número válido. Debe ser 00-0000... o 000-0000...`
    }
    }
})

// Esta es la parte clave para que el Frontend no falle (Ejercicio 3.13)
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
```

phonebook-backend/index.js:

```
require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

// --- RUTAS ---

// GET: Información de la agenda
app.get('/info', (request, response, next) => {
    Person.countDocuments({})
        .then(count => {
            response.send(`
                <p>Phonebook has info for ${count} people</p>
                <p>${new Date()}</p>
            `)
        })
        .catch(error => next(error))
})

// GET ALL: Obtener todos
app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons)
    }).catch(error => next(error))
})

// GET individual: Obtener por ID
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

// POST: Crear nuevo
app.post('/api/persons', (request, response, next) => {
    const body = request.body
    
    // Dejamos que Mongoose maneje la validación de minLength y required
    const person = new Person({ 
        name: body.name, 
        number: body.number 
    })

    person.save()
        .then(saved => response.json(saved))
        .catch(error => next(error))
})

// DELETE: Eliminar
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(() => response.status(204).end())
        .catch(error => next(error))
})

// PUT: Actualizar
// En tu app.put de index.js, asegúrate de tener esto:
app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    Person.findByIdAndUpdate(
        request.params.id, 
        { name, number }, 
        { new: true, runValidators: true, context: 'query' } // Importante para que valide al editar
    )
    .then(updatedPerson => response.json(updatedPerson))
    .catch(error => next(error))
})

// --- MANEJO DE ERRORES (Al final de todas las rutas) ---
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
    // Enviamos el mensaje generado por Mongoose al frontend
    return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
```

phonebook-frontend/App.jsx:

```
import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const personsToShow = filter === ''
    ? persons
    : persons.filter(person => 
        person.name.toLowerCase().includes(filter.toLowerCase())
      )

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmUpdate) {
        const changedPerson = { ...existingPerson, number: newNumber }
        
        axios
          .put(`http://localhost:3001/api/persons/${existingPerson.id}`, changedPerson)
          .then(response => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : response.data))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            const errorMsg = error.response.data.error 
              ? error.response.data.error 
              : `Error: ${newName} has already been removed from server`
            
            setErrorMessage(errorMsg)
            setTimeout(() => setErrorMessage(null), 5000)
          })
      }
    } else {
      const personObject = { name: newName, number: newNumber }
      
      axios
        .post('http://localhost:3001/api/persons', personObject)
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
          setErrorMessage(null)
        })
        .catch(error => {
        // En lugar de hacer .split(','), usa el mensaje tal cual viene
    const fullMessage = error.response.data.error;
    setErrorMessage(fullMessage); 
    setTimeout(() => setErrorMessage(null), 5000);
})
    }
  } // <--- Esta llave cierra addPerson

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`¿Delete ${person.name}?`)) {
      axios
        .delete(`http://localhost:3001/api/persons/${id}`)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(error => {
          alert('Este contacto ya fue eliminado del servidor')
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      {errorMessage && (
        <div className="error-notification">
          {errorMessage}
        </div>
      )}

      <div>
        filter shown with <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>

      <h3>add a new</h3>

      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
        </div>
        <button type="submit">add</button>
      </form>
      
      <h2>Numbers</h2>
      <ul>
        {personsToShow.map(person => 
          <li key={person.id}>
            {person.name} {person.number} {' '}
            <button onClick={() => deletePerson(person.id)}>Delete</button>
          </li>
        )}
      </ul>
    </div>
  )
} // <--- Esta llave cierra el componente App

export default App
```

Resumen de las reglas aplicadas:
Longitud: minLength: 8 asegura que el string total tenga al menos 8 caracteres.

Formato: La función validator comprueba que existan 2 o 3 números iniciales, seguidos de un guion y luego el resto de los números.

Respuesta HTTP: Al fallar la validación, Mongoose lanza un ValidationError, lo que hace que tu servidor responda automáticamente con 400 Bad Request gracias al middleware de errores.

Prueba estas entradas:

09-123456 ✅ (Válido)

040-223344 ✅ (Válido)

1234556 ❌ (Falla: no hay guion)

1-22334455 ❌ (Falla: la primera parte solo tiene 1 dígito)

10-22-3344 ❌ (Falla: hay más de un guion)


## Tarea 3.21 Versión de Internet usando la base de datos:

