const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
    type: String,
    required: true,
    unique: true // Asegura que no se repitan nombres de usuario en la DB
    },
    name: String,
    passwordHash: {
    type: String,
    required: true,
    },
    blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

// Formateo de la respuesta JSON para que coincida exactamente con tu imagen
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // El passwordHash JAMÁS debe revelarse en las respuestas HTTP
    delete returnedObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User