## Tarea Node.js y Express
## 3.1 Paso 1 del backend de la guía telefónica
package.json:

```
{
  "name": "notebackend",
  "version": "0.0.1",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Matti Luukkainen",
  "license": "MIT",
  "dependencies": {
    "express": "^5.2.1"
  }
}
```

index.js:

```
const express = require('express')
const app = express()

// 1. Definimos los datos (la "tabla" codificada)
let persons = [
    { id: "1", name: "Arto Hellas", number: "040-123456" },
    { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
    { id: "3", name: "Dan Abramov", number: "12-43-234345" },
    { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]

// 2. Definimos la RUTA /api/persons
// Es esta función la que crea la dirección en el navegador
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// 3. Ruta raíz opcional para probar que el servidor vive
app.get('/', (request, response) => {
    response.send('<h1>Servidor funcionando</h1><p>Ve a <a href="/api/persons">/api/persons</a> para ver los datos.</p>')
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
```

## Tarea 3.2: Backend de la guía telefónica Paso 2
index.js

```
const express = require('express')
const app = express()

let persons = [
    { id: "1", name: "Arto Hellas", number: "040-123456" },
    { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
    { id: "3", name: "Dan Abramov", number: "12-43-234345" },
    { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]

// Paso 3.1: Lista completa de personas
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// Paso 3.2: Página de información
app.get('/info', (request, response) => {
    const totalPeople = persons.length
    const date = new Date()

    response.send(`
    <div>
        <p>Phonebook has info for ${totalPeople} people</p>
        <p>${date}</p>
    </div>
    `)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
```

## Tarea 3.3: Paso 3 del backend de la guía telefónica

```
const express = require('express')
const app = express()

let persons = [
    { id: "1", name: "Arto Hellas", number: "040-123456" },
    { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
    { id: "3", name: "Dan Abramov", number: "12-43-234345" },
    { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]

// Paso 3.1: Lista completa de personas
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// Paso 3.2: Página de información
app.get('/info', (request, response) => {
    const totalPeople = persons.length
    const date = new Date()

    response.send(`
    <div>
        <p>Phonebook has info for ${totalPeople} people</p>
        <p>${date}</p>
    </div>
    `)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

// Ruta para obtener una persona específica por ID
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)

    if (person) {
    response.json(person)
    } else {
    // Si no se encuentra el ID, respondemos con 404 (Not Found)
    // El método .end() cierra la respuesta sin enviar datos
    response.status(404).end()
    }
})
```
Respuesta: GET http://localhost:3001/api/persons/5 net::ERR_HTTP_RESPONSE_CODE_FAILURE 404 (Not Found)


## Tarea 3.4: Paso 4 del backend de la guía telefónica
requests.rest (Rest client)
### Obtener todas las personas
GET http://localhost:3001/api/persons

### Borrar una persona específica
DELETE http://localhost:3001/api/persons/1

index.js:
```
const express = require('express')
const app = express()

let persons = [
    { id: "1", name: "Arto Hellas", number: "040-123456" },
    { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
    { id: "3", name: "Dan Abramov", number: "12-43-234345" },
    { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]

// Paso 3.1: Lista completa de personas
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// Paso 3.2: Página de información
app.get('/info', (request, response) => {
    const totalPeople = persons.length
    const date = new Date()

    response.send(`
    <div>
        <p>Phonebook has info for ${totalPeople} people</p>
        <p>${date}</p>
    </div>
    `)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

// Ruta para obtener una persona específica por ID
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)

    if (person) {
    response.json(person)
    } else {
    // Si no se encuentra el ID, respondemos con 404 (Not Found)
    // El método .end() cierra la respuesta sin enviar datos
    response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
  // Filtramos el arreglo: nos quedamos con todos menos con el que tiene el ID a borrar
    persons = persons.filter(person => person.id !== id)

  // Respondemos con 204 (No Content) porque la operación fue exitosa pero no hay nada que devolver
    response.status(204).end()
})
```

Respuesta: 

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 177
ETag: W/"b1-7ogoOVaxHhAH96EVI2XPZmDqXkY"
Date: Sun, 10 May 2026 21:53:28 GMT
Connection: close

[
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]
```

## Tarea 3.5: Paso 5 del backend de la guía telefónica
```
const express = require('express')
const app = express()

// Habilita el parseo de JSON (Paso 3.5)
app.use(express.json())

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

// Paso 3.5: Añadir (POST)
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' })
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

Respuesta: HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 58
ETag: W/"3a-Kjr6BqUA3CBsLzVPBXjV6u1afeU"
Date: Sun, 10 May 2026 22:05:09 GMT
Connection: close

```
{
  "id": "837644",
  "name": "Amelia Gold",
  "number": "555-123456"
}
```

## Tarea 3.6: Paso 6 del backend de la guía telefónica
index.js:

```
const express = require('express')
const app = express()

// Habilita el parseo de JSON (Paso 3.5)
app.use(express.json())

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

// Paso 3.5: Añadir (POST)
app.post('/api/persons', (request, response) => {
    const body = request.body

  // 1. Validación: ¿Falta el nombre o el número?
    if (!body.name || !body.number) {
    return response.status(400).json({ 
        error: 'name or number missing' 
    })
    }

  // 2. Validación: ¿El nombre ya existe en la lista?
  // Usamos .some() para verificar si algún elemento cumple la condición
    const nameExists = persons.some(p => p.name.toLowerCase() === body.name.toLowerCase())
    
    if (nameExists) {
    return response.status(400).json({ 
        error: 'name must be unique' 
    })
    }

  // Si pasa las validaciones, creamos la nueva persona
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

requests.rest:
```
### Obtener todas las personas
GET http://localhost:3001/api/persons

### Borrar una persona específica
DELETE http://localhost:3001/api/persons/1

### Agregar una nueva persona
POST http://localhost:3001/api/persons
Content-Type: application/json

{
    "name": "Amelia Gold",
    "number": "555-123456"
}

### Intentar introducir un nuevo contacto:
POST http://localhost:3001/api/persons
Content-Type: application/json

{
    "name": "Arto Hellas",
    "number": "123-456789"
}

Respuesta: HTTP/1.1 400 Bad Request
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 31
ETag: W/"1f-gNXq1DJ9+JOcBdUsV7SIIDnm/LY"
Date: Sun, 10 May 2026 22:15:01 GMT
Connection: close

{
  "error": "name must be unique"
}
```

