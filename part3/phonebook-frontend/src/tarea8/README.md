## Tarea 3.7: Backend de la guía telefónica Paso 7
Uso de Middlewares
- Instalamos Morgan: npm install morgan
- Configuramos Morgan en index.js
- Se usa el index.js y el requests.rest

index.js:

```
const express = require('express')
const morgan = require('morgan')
const app = express()

// Los Middlewares se configuran al principio, antes de las rutas
app.use(express.json())
app.use(morgan('tiny')) // Configuración requerida para el paso 3.7

let persons = [
    { id: "1", name: "Arto Hellas", number: "040-123456" },
    { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
    { id: "3", name: "Dan Abramov", number: "12-43-234345" },
    { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]

// Ruta raíz
app.get('/', (request, response) => {
    response.send('<h1>Phonebook Backend</h1>')
})

// Paso 3.1: Obtener todos (GET)
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// Paso 3.2: Información (GET)
app.get('/info', (request, response) => {
    const count = persons.length
    const date = new Date()
    response.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`)
})

// Paso 3.3: Obtener uno solo (GET)
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// Paso 3.4: Eliminar (DELETE)
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

// Paso 3.5 & 3.6: Añadir (POST) con validaciones
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'name or number missing' 
        })
    }

    const nameExists = persons.some(p => p.name.toLowerCase() === body.name.toLowerCase())
    
    if (nameExists) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }

    const newId = Math.floor(Math.random() * 1000000).toString()
    
    const person = {
        id: newId,
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
```

## Tarea 3.8*: Paso 8 del backend de la guía telefónica
index.js:

```
const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

// 1. Definir el token (Esto está perfecto)
morgan.token('body', (request, response) => {
    if (request.method === 'POST') {
        return JSON.stringify(request.body)
    }
    return '' 
})

// 2. Usar solo UN Morgan con el formato personalizado
// Quitamos app.use(morgan('tiny')) para no duplicar logs
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { id: "1", name: "Arto Hellas", number: "040-123456" },
    { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
    { id: "3", name: "Dan Abramov", number: "12-43-234345" },
    { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]

// --- RUTAS (GET, POST, DELETE, INFO) ---
// Tu lógica de abajo está impecable, no necesita cambios.

app.get('/', (request, response) => {
    response.send('<h1>Phonebook Backend</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const count = persons.length
    const date = new Date()
    response.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'name or number missing' })
    }

    const nameExists = persons.some(p => p.name.toLowerCase() === body.name.toLowerCase())
    if (nameExists) {
        return response.status(400).json({ error: 'name must be unique' })
    }

    const newId = Math.floor(Math.random() * 1000000).toString()
    const person = {
        id: newId,
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
```
Al apretar requests.rest, la de incluir el contacto de Amelia Gold,
resulta en la terminal:

Server running on port 3001
POST /api/persons 200 58 - 6.142 ms {"name":"Amelia Gold","number":"555-123456"}


## Tarea 3.9 Paso 9 del backend de la guía telefónica

```
npm run dev       

> notebackend@0.0.1 dev
> node --watch index.js

◇ injected env (2) from .env // tip: ◈ encrypted .env [www.dotenvx.com]
Server running on port 3001
GET /persons 404 28 - 11.030 ms -
GET /api/persons/1 200 53 - 0.765 ms -
GET /api/persons/2 200 57 - 0.347 ms -
GET /api/persons/4 200 61 - 0.300 ms -
GET /api/persons/5 404 28 - 0.240 ms -
GET /api/persons/6 404 28 - 0.298 ms -
```

phonebook-frontend\src\services\persons.js:

```
import axios from 'axios'
// phonebook-frontend/src/...
const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => axios.get(baseUrl).then(res => res.data)
const create = newPerson => axios.post(baseUrl, newPerson).then(res => res.data)
const remove = id => axios.delete(`${baseUrl}/${id}`)

const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject).then(res => res.data)
}

export default { getAll, create, remove, update }
```

phonebook-backend\index.js:

```
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

// --- MIDDLEWARES ---
app.use(cors())
app.use(express.json()) // Necesario para recibir datos en los POST
app.use(express.static('dist')) // Para servir el frontend en producción

// Configuración de Morgan para ver el cuerpo de los POST (Ejercicio 3.8)
morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// --- DATOS (Estado inicial en memoria) ---
let persons = [
    { id: "1", name: "Arto Hellas", number: "040-123456" },
    { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
    { id: "3", name: "Dan Abramov", number: "12-43-234345" },
    { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]

// --- RUTAS ---

// Obtener todos los contactos
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// Obtener un contacto por ID
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)

    if (person) {
    response.json(person)
    } else {
    response.status(404).json({ error: 'Person not found' })
    }
})

// Eliminar un contacto
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

// Añadir un nuevo contacto
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' })
    }

    if (persons.some(p => p.name === body.name)) {
    return response.status(400).json({ error: 'name must be unique' })
    }

    const person = {
    id: String(Math.floor(Math.random() * 1000000)),
    name: body.name,
    number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
})

// Ruta de información general
app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
    `)
})

// --- MANEJO DE ERRORES (Ruta no encontrada) ---
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// --- INICIO ---
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
```

## Tarea 3.10 Paso 10 del backend de la guía telefónica
# Full Stack Open 2026 - Parte 3 (Phonebook)

Este repositorio contiene la solución a los ejercicios de la Parte 3 del curso Full Stack Open. La aplicación consiste en un backend robusto para una agenda telefónica, integrado con un frontend de React.

## 🚀 Enlace de Despliegue
La aplicación está desplegada en Render y puedes acceder a los datos aquí:
**[Ver API en vivo](https://phonebook-backend-tu-usuario.onrender.com/api/persons)** *(Nota: Reemplaza este enlace con tu URL real de Render)*

## 🛠️ Tecnologías y Herramientas
- **Node.js & Express**: Servidor y API REST.
- **Middleware**: Morgan (logging), CORS (seguridad de origen), Express Static.
- **Despliegue**: Render / GitHub.
- **Entorno**: Gestión de variables con Dotenv.

## 📋 Endpoints de la API

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| GET | `/api/persons` | Devuelve todos los contactos en JSON. |
| GET | `/api/persons/:id` | Devuelve un contacto específico. |
| POST | `/api/persons` | Crea un nuevo contacto (valida nombre único). |
| DELETE | `/api/persons/:id` | Elimina un contacto por su ID. |
| GET | `/info` | Información de estado y fecha del servidor. |

## ⚙️ Instalación Local

1. Navega a la carpeta del backend: `cd part3/phonebook-backend`.
2. Instala las dependencias:
   ```bash
   npm install

- Visualización realizada en Render: https://fullstackopen2026-ah-tree-main-part3.onrender.com/api/persons

## Tarea 3.11 Guía telefónica Full Stack:
Se hicieron los cambios en backend (carpeta dist) y se subieron a github, resultando en:
https://fullstackopen2026-ah-tree-main-part3.onrender.com

## Tarea 3.12: Base de datos desde la línea de comandos:
mongo.js:

```
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Fix para DNS restringidos

require('dotenv').config(); 
const mongoose = require('mongoose');

// 1. Verificación de argumentos
if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);

console.log('Conectando a MongoDB Atlas...');

// 2. Conexión única con configuración IPv4 para redes comunitarias
mongoose.connect(url, {
    family: 4 
})
.then(() => {
    console.log('¡Conexión exitosa!');

    // 3. Definición del Esquema y Modelo
    const personSchema = new mongoose.Schema({
        name: String,
        number: String,
    });

    const Person = mongoose.model('Person', personSchema);

    // 4. Lógica: ¿Listar o Guardar?
    if (process.argv.length === 3) {
        // LISTAR contactos (ej: node mongo.js clave)
        console.log('phonebook:');
        Person.find({}).then(result => {
            result.forEach(person => {
                console.log(`${person.name} ${person.number}`);
            });
            mongoose.connection.close();
        });
    } else if (process.argv.length >= 5) {
        // AÑADIR contacto (ej: node mongo.js clave "Nombre" "12345")
        const name = process.argv[3];
        const number = process.argv[4];

        const person = new Person({
            name: name,
            number: number,
        });

        person.save().then(() => {
            console.log(`added ${name} number ${number} to phonebook`);
            mongoose.connection.close();
        });
    } else {
        console.log('Para agregar un contacto usa: node mongo.js clave "Nombre" "Numero"');
        mongoose.connection.close();
    }
})
.catch(err => {
    console.log('Error de conexión:', err.message);
});
```

Se anota: node mongo.js algo "Ada Lovelace" "040-1231236", por ejemplo (la clave "algo" está en .env)
```
◇ injected env (2) from .env // tip: ⌘ multiple files { path: ['.env.local', '.env'] }
Conectando a MongoDB Atlas...
¡Conexión exitosa!
added Ada Lovelace number 040-1231236 to phonebook
```
y se revisa con:  node mongo.js algo

```
◇ injected env (2) from .env // tip: ⌁ auth for agents [www.vestauth.com]
Conectando a MongoDB Atlas...
¡Conexión exitosa!
phonebook:
Prueba desde Playground 999-888-777
Anna 040-1234556
Arto Vihavainen 040-1234556
Ada Lovelace 040-1231236
```

## Tarea 3.13: Guía telefónica y base de datos, Paso 1
phonebook-backend\models\person.js:

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
    name: String,
    number: String,
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

index.js:

```
require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person') // Importamos el nuevo módulo
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

// GET: Recuperar todos los contactos de la DB (Ejercicio 3.13)
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
    response.json(persons)
    })
})

// POST: Guardar en la DB (Ejercicio 3.14)
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({ error: 'content missing' })
    }

    const person = new Person({
    name: body.name,
    number: body.number,
    })

    person.save().then(savedPerson => {
    response.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
```

http://localhost:3001/api/persons:
```
[
  {
    "name": "Prueba desde Playground",
    "number": "999-888-777",
    "id": "6a0360cf381e1f82e7602fd4"
  },
  {
    "name": "Anna",
    "number": "040-1234556",
    "id": "6a03759f710f178194fa1d3e"
  },
  {
    "name": "Arto Vihavainen",
    "number": "040-1234556",
    "id": "6a0375f67447fb4791962511"
  },
  {
    "name": "Ada Lovelace",
    "number": "040-1231236",
    "id": "6a03762634f2eaaa888ed355"
  }
]
```

## Tarea 3.14: Guía telefónica y base de datos, Paso 2:
index.js:

```
require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person') // Módulo de Mongoose
const cors = require('cors')

// --- MIDDLEWARES ---
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

// --- RUTAS ---

// GET: Recuperar todos los contactos de la DB (Ejercicio 3.13)
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// POST: Guardar en la DB (Ejercicio 3.14)
app.post('/api/persons', (request, response) => {
    const body = request.body

    // Validación: que no falte nombre ni número
    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'name or number missing' 
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => {
            console.log('Error al guardar:', error.message)
            response.status(500).json({ error: 'internal server error' })
        })
})

// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
```

## Tarea 3.15: Guía telefónica y base de datos, Paso 3:
App.jsx:

```
import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  // FUNCIÓN PARA BORRAR (Clave para la tarea 3.15)
  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    const result = window.confirm(`¿Delete ${person.name}?`)
    
    if (result) {
      axios
        .delete(`http://localhost:3001/api/persons/${id}`)
        .then(() => {
          // Filtramos el estado para quitar a la persona borrada de la vista
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(error => {
          alert('Este contacto ya fue eliminado del servidor')
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = { name: newName, number: newNumber }

    axios
      .post('http://localhost:3001/api/persons', personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>name: <input value={newName} onChange={(e) => setNewName(e.target.value)} /></div>
        <div>number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} /></div>
        <button type="submit">add</button>
      </form>
      <h2>Numbers</h2>
      {/* Mapeamos con el botón de borrar incluido */}
      {persons.map(person => 
        <p key={person.id}>
          {person.name} {person.number} {' '}
          <button onClick={() => deletePerson(person.id)}>Delete</button>
        </p>
      )}
    </div>
  )
}

export default App
```

Se borra el primer registro con el botón delete y quedan:
```
[
  {
    "name": "Anna",
    "number": "040-1234556",
    "id": "6a03759f710f178194fa1d3e"
  },
  {
    "name": "Arto Vihavainen",
    "number": "040-1234556",
    "id": "6a0375f67447fb4791962511"
  },
  {
    "name": "Ada Lovelace",
    "number": "040-1231236",
    "id": "6a03762634f2eaaa888ed355"
  }
]
```

## Tarea 3.16: Guía telefónica y base de datos, Paso 4:
index.js:

```
require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const cors = require('cors')

// --- MIDDLEWARES ---
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

// --- RUTAS ---

// GET: Todos los contactos (Ejercicio 3.13)
app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
        .catch(error => next(error))
})

// GET: Un solo contacto (Ejercicio 3.16)
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

// POST: Crear contacto (Ejercicio 3.14)
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'name or number missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})

// DELETE: Eliminar contacto (Ejercicio 3.15 / 3.16)
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

// --- MANEJO DE ERRORES (Ejercicio 3.16) ---

// Middleware para rutas inexistentes
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Middleware de errores centralizado (DEBE SER EL ÚLTIMO)
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}
app.use(errorHandler)

// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
```

## Tarea 3.17*: Guía telefónica y base de datos, Paso 5:
http://localhost:5173/

```
import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  // Cargar datos iniciales
  useEffect(() => {
    axios
      .get('http://localhost:3001/api/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  // FUNCIÓN PARA BORRAR (Tarea 3.15)
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

  // FUNCIÓN PARA AGREGAR O ACTUALIZAR (Tarea 3.17)
  const addPerson = (event) => {
    event.preventDefault()
    
    // Verificamos si la persona ya existe en la lista
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
            // Actualizamos el estado reemplazando solo a la persona editada
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : response.data))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            alert(`Error: ${newName} has already been removed from server`)
            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
    } else {
      // Si no existe, hacemos el POST normal (Tarea 3.14)
      const personObject = { name: newName, number: newNumber }

      axios
        .post('http://localhost:3001/api/persons', personObject)
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>name: <input value={newName} onChange={(e) => setNewName(e.target.value)} /></div>
        <div>number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} /></div>
        <button type="submit">add</button>
      </form>
      
      <h2>Numbers</h2>
      <ul>
        {persons.map(person => 
          <li key={person.id}>
            {person.name} {person.number} {' '}
            <button onClick={() => deletePerson(person.id)}>Delete</button>
          </li>
        )}
      </ul>
    </div>
  )
}

export default App
```

ahora se encuentra así el registro:
Phonebook
name: 
number: 
add
Numbers
Anna 456-890 Delete
Arto Vihavainen 040-1234556 Delete
Ada Lovelace 040-1231236 Delete

## Tarea 3.18*: Directorio telefónico y base de datos, Paso 6:
http://localhost:3001/api/persons/6a0375f67447fb4791962511:

{
  "name": "Arto Vihavainen",
  "number": "040-1234556",
  "id": "6a0375f67447fb4791962511"
}

index.js:

```
require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

// --- RUTAS NUEVAS/ACTUALIZADAS (Ejercicio 3.18) ---

// Ruta INFO: Muestra cuántas personas hay y la hora actual
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

// GET individual: Obtener una persona por ID
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

// --- RESTO DE RUTAS ---

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons)
    }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'name or number missing' })
    }
    const person = new Person({ name: body.name, number: body.number })
    person.save().then(saved => response.json(saved)).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(() => response.status(204).end())
        .catch(error => next(error))
})

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

// --- MANEJO DE ERRORES ---
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}

// GET: Información de la agenda (Ejercicio 3.18)
app.get('/info', (request, response, next) => {
    Person.countDocuments({})
        .then(count => {
            const date = new Date()
            // Enviamos HTML simple, no el frontend completo
            response.send(`
                <p>Phonebook has info for ${count} people</p>
                <p>${date}</p>
            `)
        })
        .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
```