const app = require('./app') // Importa la app armada arriba
const config = require('./utils/config')

app.listen(config.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${config.PORT}`)
})