const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

// 1. Logger de peticiones entrantes
const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

// 2. Extractor de Token (¡Mantenlo aquí, lo necesitas!)
const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    
    if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
    } else {
    request.token = null
    }

    next()
}

// 3. Extractor de Usuario (Usa el request.token que dejó el paso anterior)
const userExtractor = async (request, response, next) => {
    if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (decodedToken.id) {
        request.user = await User.findById(decodedToken.id)
    }
    }
    
    next()
}

// 4. Manejador para rutas inexistentes
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// 5. Manejador de errores global
// utils/middleware.js

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') { 
    return response.status(401).json({ error: 'token missing or invalid' })
    } else if (error.name === 'TokenExpiredError') { 
    return response.status(401).json({ error: 'token expired' })
    } 
    
  // NUEVO VALIDADOR: Atrapa errores de duplicación en MongoDB (Código 11000)
    else if (error.name === 'MongoServerError' && error.message.includes('E11000')) {
    return response.status(400).json({ 
        error: 'expected `username` to be unique' 
    })
    }

    next(error)
}

// Exportación única y correcta de las 5 funciones
module.exports = {
    requestLogger,
    tokenExtractor,
    userExtractor,
    unknownEndpoint,
    errorHandler
}