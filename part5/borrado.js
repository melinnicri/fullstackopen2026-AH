// 1. Aseguramos usar la base de datos correcta (con minúsculas como sale en tu captura)
use('bloglistApp');

// 2. Ejecutamos el borrado masivo
// Vamos a borrar TODO, excepto los 10 primeros que existan.
const todo = db.getCollection('blogs').find({}).sort({ _id: 1 }).toArray();

if (todo.length > 10) {
    const idsAborrar = todo.slice(10).map(b => b._id);
    const resultado = db.getCollection('blogs').deleteMany({ _id: { $in: idsAborrar } });
    console.log('Documentos eliminados:', resultado.deletedCount);
} else {
    console.log('Tienes 10 o menos documentos, no hay nada que borrar.');
}