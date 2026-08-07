use('bloglistApp');

// 1. Obtener solo los documentos, y proyectar explícitamente el _id
// Usamos .toArray() para convertir el cursor en un array plano
const blogs = db.blogs.find({}, { _id: 1 })
                        .sort({ _id: 1 })
                        .limit(10)
                        .toArray();

// 2. Extraer solo los IDs de forma segura
const keepIds = blogs.map(b => b._id);

// 3. Eliminar todo lo demás
const result = db.blogs.deleteMany({ _id: { $nin: keepIds } });

console.log(`Limpieza finalizada. Documentos eliminados: ${result.deletedCount}`);