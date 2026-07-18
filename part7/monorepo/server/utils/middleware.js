const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userExtractor = async (request, response, next) => {
    const authorization = request.get('authorization')
    
    if (authorization && authorization.startsWith('Bearer ')) {
        const token = authorization.replace('Bearer ', '')
        
        try {
            const decodedToken = jwt.verify(token, process.env.SECRET)
            if (decodedToken.id) {
                request.user = await User.findById(decodedToken.id)
            }
        } catch (error) {
            return response.status(401).json({ error: 'token invalid' })
        }
    }
    
    next()
}

module.exports = { userExtractor }