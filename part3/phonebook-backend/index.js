require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

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