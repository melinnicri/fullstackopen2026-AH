const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    try {
        const { username, password } = request.body
        const user = await User.findOne({ username })

        if (!username || !password) {
            return response.status(400).json({ error: 'username and password are required' })
        }
        ("--- DEBUG LOGIN ---");
        ("Usuario buscado:", username);
        ("Password recibida en texto plano:", password);
        ("Hash almacenado en BD:", user.passwordHash);

        const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
        ("Resultado de bcrypt.compare:", passwordCorrect);
        
        if (!passwordCorrect) {
            return response.status(401).json({ error: 'invalid username or password' })
        }

        const userForToken = { username: user.username, id: user._id }
        const token = jwt.sign(userForToken, process.env.SECRET)

        response.status(200).send({ token, username: user.username, name: user.name })
    } catch (error) {
        console.error("Error crítico en login:", error)
        response.status(500).json({ error: 'internal server error' })
    }
})

module.exports = loginRouter