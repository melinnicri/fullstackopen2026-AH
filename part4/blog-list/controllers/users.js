const usersRouter = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user')

// GET /api/users - Lista usuarios mostrando sus blogs añadidos (Imagen 3)
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { url: 1, title: 1, author: 1 }) // Cruza colecciones de forma inversa

  response.json(users)
})

// POST /api/users - Permanece exactamente igual que en el 4.16*
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!username || username.length < 3) {
    return response.status(400).json({ error: 'username must be at least 3 characters long and required' })
  }
  if (!password || password.length < 3) {
    return response.status(400).json({ error: 'password must be at least 3 characters long and required' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter