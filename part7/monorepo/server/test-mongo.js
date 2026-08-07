const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb://melinnicri_db_user:jHOa6i2OUU0G1c6p@ac-s0wyfwv-shard-00-00.7sao3di.mongodb.net:27017,ac-s0wyfwv-shard-00-01.7sao3di.mongodb.net:27017,ac-s0wyfwv-shard-00-02.7sao3di.mongodb.net:27017/?ssl=true&replicaSet=atlas-mftfkk-shard-0&authSource=admin&appName=Zustand"

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        ("¡Conexión exitosa!");
    } catch (err) {
        console.error("Error capturado:", err);
    } finally {
        await client.close();
    }
}
run().catch(console.dir);