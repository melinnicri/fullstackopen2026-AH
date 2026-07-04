const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  // 1. Buscar al usuario en la base de datos
  const user = await User.findOne({ username })

  // 2. Verificar la contraseña usando bcrypt
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  // 3. Si no existe el usuario o la contraseña es incorrecta, rechazar
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  // 4. Estructurar los datos que viajan cifrados dentro del token (Payload)
  const userForToken = {
    username: user.username,
    id: user._id,
  }

  // 5. Firmar el token digitalmente SIN tiempo de expiración para evitar bloqueos de reloj
  const token = jwt.sign(userForToken, process.env.SECRET)

  // 6. Responder con el token y los datos públicos del usuario
  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter