const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express() 
const cors = require('cors')

// Importación de Controladores
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

// Importación de Middlewares y utilidades
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

// Conexión a MongoDB
mongoose.set('strictQuery', false)
logger.info('Conectando a', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
    .then(() => logger.info('Conectado a MongoDB'))
    .catch((error) => logger.error('Error conectando a MongoDB:', error.message))

// Middlewares Globales
app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

// Registro de Rutas
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

// Registro de Rutas de Test (Solo en entorno de test)
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

// Middlewares de Cierre
app.use(middleware.unknownEndpoint) 
app.use(middleware.errorHandler)

module.exports = app