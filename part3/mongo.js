const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Fix para DNS restringidos

require('dotenv').config(); 
const mongoose = require('mongoose');

// 1. Verificación de argumentos
if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);

console.log('Conectando a MongoDB Atlas...');

// 2. Conexión única con configuración IPv4 para redes comunitarias
mongoose.connect(url, {
    family: 4 
})
.then(() => {
    console.log('¡Conexión exitosa!');

    // 3. Definición del Esquema y Modelo
    const personSchema = new mongoose.Schema({
        name: String,
        number: String,
    });

    const Person = mongoose.model('Person', personSchema);

    // 4. Lógica: ¿Listar o Guardar?
    if (process.argv.length === 3) {
        // LISTAR contactos (ej: node mongo.js clave)
        console.log('phonebook:');
        Person.find({}).then(result => {
            result.forEach(person => {
                console.log(`${person.name} ${person.number}`);
            });
            mongoose.connection.close();
        });
    } else if (process.argv.length >= 5) {
        // AÑADIR contacto (ej: node mongo.js clave "Nombre" "12345")
        const name = process.argv[3];
        const number = process.argv[4];

        const person = new Person({
            name: name,
            number: number,
        });

        person.save().then(() => {
            console.log(`added ${name} number ${number} to phonebook`);
            mongoose.connection.close();
        });
    } else {
        console.log('Para agregar un contacto usa: node mongo.js clave "Nombre" "Numero"');
        mongoose.connection.close();
    }
})
.catch(err => {
    console.log('Error de conexión:', err.message);
});