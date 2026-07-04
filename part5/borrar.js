const mongoose = require('mongoose');
const Blog = require('./models/blog'); 

const url = 'TU_URL_DE_MONGO_ATLAS';

const ejecutarBorrado = async () => {
  try {
    await mongoose.connect(url);
    console.log('Conectado a MongoDB...');

    // Obtenemos todos los blogs ordenados por creación (_id contiene el timestamp)
    const blogs = await Blog.find({}).sort({ _id: 1 });
    
    if (blogs.length > 10) {
      const aBorrar = blogs.slice(10); 
      const ids = aBorrar.map(b => b._id);
      
      await Blog.deleteMany({ _id: { $in: ids } });
      console.log(`Éxito: Se borraron ${ids.length} registros. Ahora quedan ${blogs.length - ids.length}.`);
    } else {
      console.log('No hay suficientes registros para borrar.');
    }
  } catch (error) {
    console.error('Error al limpiar la base de datos:', error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

ejecutarBorrado();