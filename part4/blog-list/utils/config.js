require('dotenv').config()

const PORT = process.env.PORT

// Si el entorno es 'test', usa la base de datos de pruebas
const MONGODB_URI = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

module.exports = {
    MONGODB_URI,
    PORT
}