const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: { 
    type: String, 
    required: true 
    },
    author: String,
    url: { 
    type: String, 
    required: true 
    },
    likes: { 
    type: Number, 
    default: 0 // <-- Solución al 4.11* (si no vienen likes, por defecto es 0)
    },
  // Enlace al usuario creador (Requisito del 4.17)
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
    }
})

// Modificamos el método toJSON una sola vez para formatear la salida de los datos
blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() // <-- Solución al 4.9 (de _id a id)
    delete returnedObject._id
    delete returnedObject.__v
    }
})

// Exportamos el modelo una sola vez al final del archivo
module.exports = mongoose.model('Blog', blogSchema)