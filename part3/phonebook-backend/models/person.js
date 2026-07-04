const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

// Usamos la variable de entorno que ya configuramos en tu .env
const url = process.env.MONGODB_URI

console.log('Conectando a', url)

mongoose.connect(url, { family: 4 }) // Mantenemos el fix de IPv4 para Tacna
    .then(result => {
    console.log('Conectado a MongoDB Atlas')
    })
    .catch((error) => {
    console.log('Error al conectar a MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
    type: String,
    minLength: 3,
    required: true
    },
    number: {
    type: String,
    minLength: 8, // Regla: Al menos 8 caracteres
    required: true,
    validate: {
        validator: function(v) {
        // Explicación de la Regex:
        // ^\d{2,3}      -> Empieza con 2 o 3 dígitos
        // -             -> Un guion obligatorio
        // \d+$          -> Sigue con uno o más dígitos hasta el final
        return /^\d{2,3}-\d+$/.test(v);
        },
        message: props => `${props.value} no es un formato de número válido. Debe ser 00-0000... o 000-0000...`
    }
    }
})

// Esta es la parte clave para que el Frontend no falle (Ejercicio 3.13)
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)