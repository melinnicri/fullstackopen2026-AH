const { MongoClient } = require('mongodb');

const uri = "mongodb://melinnicri_db_user:jHOa6i2OUU0G1c6p@ac-s0wyfwv-shard-00-00.7sao3di.mongodb.net:27017,ac-s0wyfwv-shard-00-01.7sao3di.mongodb.net:27017,ac-s0wyfwv-shard-00-02.7sao3di.mongodb.net:27017/?ssl=true&replicaSet=atlas-mftfkk-shard-0&authSource=admin&appName=Zustand"

async function run() {
    ("Intentando conectar a MongoDB Atlas...");
    const client = new MongoClient(uri);
    try {
        await client.connect();
        ("¡Conexión exitosa!");
        await client.db("admin").command({ ping: 1 });
        ("Ping exitoso, base de datos operativa.");
    } catch (err) {
        console.error("Error detectado en el diagnóstico:");
        console.error("Código de error:", err.code);
        console.error("Mensaje:", err.message);
    } finally {
        await client.close();
    }
}

run();