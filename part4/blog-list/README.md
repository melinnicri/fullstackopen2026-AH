## Tarea 4.1 Lista de blogs, Paso 1
# Blog List Application
Parte 4 del curso FullStackOpen.

## Para ejecutar:
1. npm install
2. Crear un archivo .env con MONGODB_URI y PORT
3. npm run dev

## Tarea 4.2 Lista de blogs, Paso 2
Estructura de las carpetas:

part4/blog-list:

```text
├── controllers
│   └── blogs.js       <-- Lógica de rutas
├── models
│   └── blog.js        <-- Esquema de base de datos
├── utils
│   ├── config.js      <-- Variables de entorno (.env)
│   ├── logger.js      <-- (Opcional pero recomendado) Para console.logs
│   └── middleware.js  <-- (Opcional) Manejo de errores
├── app.js             <-- Conexión a DB y configuración de Express
├── index.js           <-- Punto de entrada del servidor
├── package.json
└── .env  


## Tarea 4.3: Funciones auxiliares y pruebas unitarias, Paso 1
utils/list_helper.js:

´´´
const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.length === 0
    ? 0
    : blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null

    const favorite = blogs.reduce((prev, current) => {
    return (prev.likes > current.likes) ? prev : current
    })

    return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
    }
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null

  // Contamos cuántos blogs tiene cada autor
    const authorCounts = _.countBy(blogs, 'author')
    
  // Encontramos el autor con el valor más alto
    const topAuthor = _.maxBy(Object.keys(authorCounts), (author) => authorCounts[author])

    return {
    author: topAuthor,
    blogs: authorCounts[topAuthor]
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null

  // Agrupamos blogs por autor y sumamos sus likes
    const authorLikes = _(blogs)
    .groupBy('author')
    .map((objs, key) => ({
        author: key,
        likes: _.sumBy(objs, 'likes')
    }))
    .value()

    return _.maxBy(authorLikes, 'likes')
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
´´´


tests/list_helper.test.js:

´´´
const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const blogs = [
    { _id: "5a422a851b54a676234d17f7", title: "React patterns", author: "Michael Chan", url: "https://reactpatterns.com/", likes: 7, __v: 0 },
    { _id: "5a422aa71b54a676234d17f8", title: "Go To Statement Considered Harmful", author: "Edsger W. Dijkstra", url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", likes: 5, __v: 0 },
    { _id: "5a422b3a1b54a676234d17f9", title: "Canonical string reduction", author: "Edsger W. Dijkstra", url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD0808.html", likes: 12, __v: 0 },
    { _id: "5a422b891b54a676234d17fa", title: "First class tests", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", likes: 10, __v: 0 },
    { _id: "5a422ba91b54a676234d17fb", title: "TDD harms architecture", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", likes: 0, __v: 0 },
    { _id: "5a422bc61b54a676234d17fc", title: "Type wars", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", likes: 2, __v: 0 }
]

test('4.3: dummy returns one', () => {
    assert.strictEqual(listHelper.dummy([]), 1)
})

describe('4.4: total likes', () => {
    test('of a bigger list is calculated right', () => {
    assert.strictEqual(listHelper.totalLikes(blogs), 36)
    })

    test('of empty list is zero', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
    })
})

describe('4.5: favorite blog', () => {
    test('returns the blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        likes: 12
    })
    })
})

describe('4.6: most blogs', () => {
    test('returns the author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, {
        author: "Robert C. Martin",
        blogs: 3
    })
    })
})

describe('4.7: most likes', () => {
    test('returns the author with most total likes', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, {
        author: "Edsger W. Dijkstra",
        likes: 17
    })
    })
})
´´´

PS C:\...\fullstackopen2026\part4\blog-list> npm test          

> blog-list@1.0.0 test
> node --test

✔ 4.3: dummy returns one (2.465ms)
▶ 4.4: total likes
  ✔ of a bigger list is calculated right (0.4469ms)
  ✔ of empty list is zero (0.3054ms)
✔ 4.4: total likes (1.3397ms)
▶ 4.5: favorite blog
  ✔ returns the blog with most likes (4.3703ms)
✔ 4.5: favorite blog (5.5238ms)
▶ 4.6: most blogs
  ✔ returns the author with most blogs (5.4194ms)
✔ 4.6: most blogs (6.6971ms)
▶ 4.7: most likes
  ✔ returns the author with most total likes (1.2488ms)
✔ 4.7: most likes (1.5316ms)
ℹ tests 6
ℹ suites 4
ℹ pass 6
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 255.3158


## Tarea 4.4: Funciones auxiliares y pruebas unitarias, Paso 2
Uso de "reduce" en los helpers anteriores.

## Tarea 4.5*: Funciones auxiliares y pruebas unitarias, Paso 3
Uso de "deepStrictEqual" en los tests.

## Tarea 4.6*: Funciones auxiliares y pruebas unitarias, Paso 4
Se logra contar frecuencias por autor (countBy) y extraer el máximo.

## Tarea 4.7*: Funciones auxiliares y pruebas unitarias, STEP5
Se implementa un flujo de "Map-Reduce" para sumar likes por autor y determinar el líder de popularidad.

## Tarea 4.8: Pruebas de lista de blogs, Paso 1
Instalo npm install cross-env --save-dev
package.js:
´´´
{
  "name": "blog-list",
  "version": "1.0.0",
  "description": "Aplicación de lista de blogs - FullStackOpen Parte 4",
  "main": "index.js",
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development node --watch index.js",
    "test": "cross-env NODE_ENV=test node --test",
    "lint": "eslint ."
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "lodash": "^4.18.1",
    "mongoose": "^8.4.1"
  },
  "devDependencies": {
    "cross-env": "^10.1.0",
    "supertest": "^7.2.2"
  }
}
´´´

config.js:

´´´
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
´´´

blog_api_tests.js:

´´´
const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // Importa tu aplicación Express
const api = supertest(app)    // Envuelve la app con supertest
const Blog = require('../models/blog')

// Datos iniciales para que la base de datos de test no esté vacía
const initialBlogs = [
    {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
    },
    {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD0808.html",
    likes: 12
    }
]

// Antes de cada test, vacía la DB e inserta los blogs iniciales
beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
})

test('los blogs se devuelven en formato json y en la cantidad correcta', async () => {
  // 1. Verifica que la petición responda con status 200 y Content-Type JSON
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

  // 2. Verifica que el cuerpo de la respuesta tenga la longitud correcta
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
})

// Cierra la conexión al terminar todas las pruebas para que el proceso no se quede colgado
after(async () => {
    await mongoose.connection.close()
})
´´´

test_helper.js:

´´´
const Blog = require('../models/blog')

const initialBlogs = [
    {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
    },
    {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD0808.html",
    likes: 12
    }
]

const nonExistingId = async () => {
    const blog = new Blog({ title: 'willremovethissoon', author: 'temp', url: 'http://temp.com' })
    await blog.save()
    await blog.deleteOne()
    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs,
    nonExistingId,
    blogsInDb
}
´´´

note_api.test.js:

´´´
const { test, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('notes are returned as json', async () => {
    await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

after(async () => {
    await mongoose.connection.close()
})
´´´

blogs.js:

´´´
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// Agrega la palabra clave 'async' antes de los parámetros
blogsRouter.get('/', async (request, response) => {
  // Usa 'await' para esperar la respuesta de la base de datos de forma lineal
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)
    blog.save().then((result) => {
    response.status(201).json(result)
    })
})

module.exports = blogsRouter
´´´

Se aplica npm test

Resulta en:
PS C:\...\fullstackopen2026\part4\blog-list> npm test

> blog-list@1.0.0 test
> cross-env NODE_ENV=test node --test

Conectando a mongodb:...27017/test_bloglistApp?ssl=true&replicaSet=atlas-tx04sx-shard-0&authSource=admin&retryWrites=true&w=majority
Conectado a MongoDB
✔ los blogs se devuelven en formato json y en la cantidad correcta (2469.8272ms)
✔ 4.3: dummy returns one (1.5937ms)
▶ 4.4: total likes
  ✔ of a bigger list is calculated right (0.334ms)
  ✔ of empty list is zero (0.2359ms)
✔ 4.4: total likes (1.04ms)
▶ 4.5: favorite blog
  ✔ returns the blog with most likes (1.3382ms)
✔ 4.5: favorite blog (1.6126ms)
▶ 4.6: most blogs
  ✔ returns the author with most blogs (0.8559ms)
✔ 4.6: most blogs (1.0439ms)
▶ 4.7: most likes
  ✔ returns the author with most total likes (1.2686ms)
✔ 4.7: most likes (1.5743ms)
ℹ tests 7
ℹ suites 4
ℹ pass 7
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3882.7411


## Tarea 4.9: Pruebas de lista de blogs, Paso 2
blog_api.tests.js:

´´´
const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // Importa tu aplicación Express
const api = supertest(app)    // Envuelve la app con supertest
const Blog = require('../models/blog')

// Datos iniciales para que la base de datos de test no esté vacía
const initialBlogs = [
    {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
    },
    {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD0808.html",
    likes: 12
    }
]

// Antes de cada test, vacía la DB e inserta los blogs iniciales
beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
})

test('los blogs se devuelven en formato json y en la cantidad correcta', async () => {
  // 1. Verifica que la petición responda con status 200 y Content-Type JSON
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

        test('el campo identificador único de los blogs se llama id', async () => {
    const response = await api.get('/api/blogs')

  // Tomamos el primer blog de la lista que devolvió el servidor
    const primerBlog = response.body[0]

  // Verificamos que la propiedad 'id' exista (que no sea undefined)
    assert.ok(primerBlog.id)
            
  // Opcional: Verificamos que el '_id' original de Mongo ya no esté expuesto
    assert.strictEqual(primerBlog._id, undefined)
})

  // 2. Verifica que el cuerpo de la respuesta tenga la longitud correcta
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
})

// Cierra la conexión al terminar todas las pruebas para que el proceso no se quede colgado
after(async () => {
    await mongoose.connection.close()
})
´´´

blog.js:

´´´
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

// Modificamos el método toJSON del esquema
blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
    // Creamos la propiedad 'id' basada en el '_id' de tipo ObjectId convertido a String
    returnedObject.id = returnedObject._id.toString()
    
    // Eliminamos las propiedades internas que no queremos exponer al frontend
    delete returnedObject._id
    delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)
´´´

PS C:\...\fullstackopen2026\part4\blog-list> npm test

> blog-list@1.0.0 test
> cross-env NODE_ENV=test node --test

Conectando a mongodb://melinnicri:...mongodb.net:27017/test_bloglistApp?ssl=true&replicaSet=atlas-tx04sx-shard-0&authSource=admin&retryWrites=true&w=majority
Conectado a MongoDB
▶ los blogs se devuelven en formato json y en la cantidad correcta
  ✔ el campo identificador único de los blogs se llama id (377.4029ms)
✔ los blogs se devuelven en formato json y en la cantidad correcta (2931.8597ms)
✔ 4.3: dummy returns one (1.0986ms)
▶ 4.4: total likes
  ✔ of a bigger list is calculated right (0.2352ms)
  ✔ of empty list is zero (0.2258ms)
✔ 4.4: total likes (0.8077ms)
▶ 4.5: favorite blog
  ✔ returns the blog with most likes (0.9683ms)
✔ 4.5: favorite blog (1.1616ms)
▶ 4.6: most blogs
  ✔ returns the author with most blogs (0.6127ms)
✔ 4.6: most blogs (0.8204ms)
▶ 4.7: most likes
  ✔ returns the author with most total likes (0.8827ms)
✔ 4.7: most likes (1.1059ms)
ℹ tests 8
ℹ suites 4
ℹ pass 8
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3647.6689


## Tarea 4.10: Pruebas de lista de blogs, Paso 3

blog_api.tests.js:

´´´
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') 
const api = supertest(app)    

// Importamos el helper que contiene nuestros datos iniciales y funciones de apoyo
const helper = require('./test_helper')
const Blog = require('../models/blog')

describe('Pruebas de la API de blogs', () => {

  // Antes de cada test, vacía la DB e inserta los blogs iniciales desde el helper
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  describe('Visualización de blogs (GET)', () => {
    
    test('4.8: los blogs se devuelven en formato json y en la cantidad correcta', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('4.9: el campo identificador único de los blogs se llama id', async () => {
      const response = await api.get('/api/blogs')
      const primerBlog = response.body[0]

      // Verificamos que exista 'id' y que '_id' se haya eliminado
      assert.ok(primerBlog.id)
      assert.strictEqual(primerBlog._id, undefined)
    })

  })

  describe('Adición de un nuevo blog (POST)', () => {

    test('4.10: un blog válido puede ser añadido correctamente', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const newBlog = {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2014/12/17/TheAnatomyOfAnAdvancedTDDSubtest.html",
        likes: 5
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201) 
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert(titles.includes("TDD harms architecture"))
    })

  })

})

// Cierra la conexión de Mongoose al final de TODO el bloque de pruebas
after(async () => {
  await mongoose.connection.close()
})
´´´

blogs.js:

´´´
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// Agrega la palabra clave 'async' antes de los parámetros
blogsRouter.get('/', async (request, response) => {
  // Usa 'await' para esperar la respuesta de la base de datos de forma lineal
    const blogs = await Blog.find({})
    response.json(blogs)
})

// 1. Agregamos la palabra clave 'async' en la definición de la función
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  // 2. Reemplazamos el bloque .then() usando 'await'
  const savedBlog = await blog.save()
  
  // 3. Respondemos al cliente con el documento JSON formateado
  response.status(201).json(savedBlog)
})

module.exports = blogsRouter
´´´

Resulta en:
PS C:\...\fullstackopen2026\part4\blog-list> npm test    

> blog-list@1.0.0 test
> cross-env NODE_ENV=test node --test

Conectando a mongodb://...mongodb.net:27017/test_bloglistApp?ssl=true&replicaSet=atlas-tx04sx-shard-0&authSource=admin&retryWrites=true&w=majority
Conectado a MongoDB
▶ Pruebas de la API de blogs
  ▶ Visualización de blogs (GET)
    ✔ 4.8: los blogs se devuelven en formato json y en la cantidad correcta (2605.0833ms)
    ✔ 4.9: el campo identificador único de los blogs se llama id (351.5607ms)
  ✔ Visualización de blogs (GET) (2959.6185ms)
  ▶ Adición de un nuevo blog (POST)
    ✔ 4.10: un blog válido puede ser añadido correctamente (935.9092ms)
  ✔ Adición de un nuevo blog (POST) (936.7565ms)
✔ Pruebas de la API de blogs (3898.3435ms)
✔ 4.3: dummy returns one (2.3039ms)
▶ 4.4: total likes
  ✔ of a bigger list is calculated right (0.3837ms)
  ✔ of empty list is zero (0.3894ms)
✔ 4.4: total likes (1.4223ms)
▶ 4.5: favorite blog
  ✔ returns the blog with most likes (5.0306ms)
✔ 4.5: favorite blog (6.1963ms)
▶ 4.6: most blogs
  ✔ returns the author with most blogs (1.5409ms)
✔ 4.6: most blogs (1.8258ms)
▶ 4.7: most likes
  ✔ returns the author with most total likes (2.1146ms)
✔ 4.7: most likes (2.5716ms)
ℹ tests 9
ℹ suites 7
ℹ pass 9
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 6479.3569


## Tarea 4.11*: Pruebas de la lista de blogs, Paso 4

blog_api.tests.js:

´´´
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') 
const api = supertest(app)    

// Importamos el helper que contiene nuestros datos iniciales y funciones de apoyo
const helper = require('./test_helper')
const Blog = require('../models/blog')

describe('Pruebas de la API de blogs', () => {

  // Antes de cada test, vacía la DB e inserta los blogs iniciales desde el helper
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  describe('Visualización de blogs (GET)', () => {
    
    test('4.8: los blogs se devuelven en formato json y en la cantidad correcta', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('4.9: el campo identificador único de los blogs se llama id', async () => {
      const response = await api.get('/api/blogs')
      const primerBlog = response.body[0]

      assert.ok(primerBlog.id)
      assert.strictEqual(primerBlog._id, undefined)
    })

  })

  describe('Adición de un nuevo blog (POST)', () => {

    // TEST 4.10: Abre y cierra de forma independiente
    test('4.10: un blog válido puede ser añadido correctamente', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const newBlog = {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2014/12/17/TheAnatomyOfAnAdvancedTDDSubtest.html",
        likes: 5
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201) 
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert(titles.includes("TDD harms architecture"))
    })

    // TEST 4.11*: Es vecino del 4.10, no su hijo
    test('4.11*: si la propiedad likes falta, se fijará en 0 por defecto', async () => {
      const newBlogWithoutLikes = {
        title: "Escribiendo código limpio sin esfuerzo",
        author: "Martin Fowler",
        url: "https://martinfowler.com/articles/injection.html"
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlogWithoutLikes)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 0)
    })

  })

})

// Cierra la conexión de Mongoose al final de TODO el bloque de pruebas
after(async () => {
  await mongoose.connection.close()
})
´´´

blog.js:

´´´
const mongoose = require('mongoose')

// FUSIONADO: Definimos el esquema una sola vez incorporando el default: 0
const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: { 
    type: Number, 
    default: 0 // <-- Solución al 4.11*
    }
})

// Modificamos el método toJSON una sola vez
blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() // <-- Solución al 4.9
    delete returnedObject._id
    delete returnedObject.__v
    }
})

// Exportamos el modelo una sola vez al final del archivo
module.exports = mongoose.model('Blog', blogSchema)
´´´

blogs.js:

´´´
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// Agrega la palabra clave 'async' antes de los parámetros
blogsRouter.get('/', async (request, response) => {
  // Usa 'await' para esperar la respuesta de la base de datos de forma lineal
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes // Si viene undefined, el modelo aplica el default: 0
  })

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

module.exports = blogsRouter
´´´

Respuesta:

PS C:\...\fullstackopen2026\part4\blog-list> npm test

> blog-list@1.0.0 test
> cross-env NODE_ENV=test node --test

Conectando a mongodb://...mongodb.net:27017/test_bloglistApp?ssl=true&replicaSet=atlas-tx04sx-shard-0&authSource=admin&retryWrites=true&w=majority
Conectado a MongoDB
▶ Pruebas de la API de blogs
  ▶ Visualización de blogs (GET)
    ✔ 4.8: los blogs se devuelven en formato json y en la cantidad correcta (2191.4816ms)
    ✔ 4.9: el campo identificador único de los blogs se llama id (351.9619ms)
  ✔ Visualización de blogs (GET) (2545.5658ms)
  ▶ Adición de un nuevo blog (POST)
    ✔ 4.10: un blog válido puede ser añadido correctamente (750.6266ms)
    ✔ 4.11*: si la propiedad likes falta, se fijará en 0 por defecto (519.0302ms)
  ✔ Adición de un nuevo blog (POST) (1271.1174ms)
✔ Pruebas de la API de blogs (3818.1971ms)
✔ 4.3: dummy returns one (2.5576ms)
▶ 4.4: total likes
  ✔ of a bigger list is calculated right (0.6286ms)
  ✔ of empty list is zero (0.4093ms)
✔ 4.4: total likes (1.8788ms)
▶ 4.5: favorite blog
  ✔ returns the blog with most likes (2.5774ms)
✔ 4.5: favorite blog (3.0689ms)
▶ 4.6: most blogs
  ✔ returns the author with most blogs (1.0602ms)
✔ 4.6: most blogs (1.3886ms)
▶ 4.7: most likes
  ✔ returns the author with most total likes (1.6152ms)
✔ 4.7: most likes (2.0118ms)
ℹ tests 10
ℹ suites 7
ℹ pass 10
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 5251.469


## Tarea 4.12*: Pruebas de lista de blog, Paso 5

blog.js:

´´´
const mongoose = require('mongoose')

// FUSIONADO: Definimos el esquema una sola vez incorporando el default: 0
const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: { 
    type: Number, 
    default: 0 // <-- Solución al 4.11*
    }
})

// Modificamos el método toJSON una sola vez
blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() // <-- Solución al 4.9
    delete returnedObject._id
    delete returnedObject.__v
    }
})

// Exportamos el modelo una sola vez al final del archivo
module.exports = mongoose.model('Blog', blogSchema)
´´´

blogs.js:

´´´
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// 4.8 y 4.9: GET de blogs usando async/await
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

// FUSIONADO (4.10, 4.11* y 4.12*): Una sola ruta POST con todas las reglas
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  // 1. Validación del paso 4.12*: Si falta título o URL, cortamos de inmediato
  if (!body.title || !body.url) {
    return response.status(400).end()
  }

  // 2. Creación del objeto (Paso 4.10 y 4.11* con default: 0 desde el modelo)
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes 
  })

  // 3. Guardado asíncrono
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

module.exports = blogsRouter
´´´

blog_api.tests.js:

´´´
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') 
const api = supertest(app)    

// Importamos el helper que contiene nuestros datos iniciales y funciones de apoyo
const helper = require('./test_helper')
const Blog = require('../models/blog')

describe('Pruebas de la API de blogs', () => {

  // Antes de cada test, vacía la DB e inserta los blogs iniciales desde el helper
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  describe('Visualización de blogs (GET)', () => {
    
    test('4.8: los blogs se devuelven en formato json y en la cantidad correcta', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('4.9: el campo identificador único de los blogs se llama id', async () => {
      const response = await api.get('/api/blogs')
      const primerBlog = response.body[0]

      assert.ok(primerBlog.id)
      assert.strictEqual(primerBlog._id, undefined)
    })

  })

  describe('Adición de un nuevo blog (POST)', () => {

    test('4.10: un blog válido puede ser añadido correctamente', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const newBlog = {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2014/12/17/TheAnatomyOfAnAdvancedTDDSubtest.html",
        likes: 5
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201) 
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert(titles.includes("TDD harms architecture"))
    })

    test('4.11*: si la propiedad likes falta, se fijará en 0 por defecto', async () => {
      const newBlogWithoutLikes = {
        title: "Escribiendo código limpio sin esfuerzo",
        author: "Martin Fowler",
        url: "https://martinfowler.com/articles/injection.html"
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlogWithoutLikes)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 0)
    })

    // CORREGIDO: El test 4.12* ahora está bien guardado dentro del describe de POST
    test('4.12*: si falta el título o la url, el servidor responde con 400 Bad Request', async () => {
      const incompleteBlog = {
        author: "Anonymous",
        likes: 24
      }

      await api
        .post('/api/blogs')
        .send(incompleteBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

  }) // Aquí cierra el describe de POST

}) // Aquí cierra el describe principal de la API de blogs

// Cierra la conexión de Mongoose al final de TODO el bloque de pruebas
after(async () => {
  await mongoose.connection.close()
})
´´´

Resultado:


PS C:\...\fullstackopen2026\part4\blog-list> npm test

> blog-list@1.0.0 test
> cross-env NODE_ENV=test node --test

Conectando a mongodb://...mongodb.net:27017/test_bloglistApp?ssl=true&replicaSet=atlas-tx04sx-shard-0&authSource=admin&retryWrites=true&w=majority
Conectado a MongoDB
▶ Pruebas de la API de blogs
  ▶ Visualización de blogs (GET)
    ✔ 4.8: los blogs se devuelven en formato json y en la cantidad correcta (2255.1898ms)
    ✔ 4.9: el campo identificador único de los blogs se llama id (348.5018ms)
  ✔ Visualización de blogs (GET) (2605.3594ms)
  ▶ Adición de un nuevo blog (POST)
    ✔ 4.10: un blog válido puede ser añadido correctamente (588.5955ms)
    ✔ 4.11*: si la propiedad likes falta, se fijará en 0 por defecto (359.3744ms)
    ✔ 4.12*: si falta el título o la url, el servidor responde con 400 Bad Request (488.8253ms)
  ✔ Adición de un nuevo blog (POST) (1437.7202ms)
✔ Pruebas de la API de blogs (4044.4962ms)
✔ 4.3: dummy returns one (2.6402ms)
▶ 4.4: total likes
  ✔ of a bigger list is calculated right (0.3467ms)
  ✔ of empty list is zero (0.2249ms)
✔ 4.4: total likes (1.1388ms)
▶ 4.5: favorite blog
  ✔ returns the blog with most likes (3.2954ms)
✔ 4.5: favorite blog (3.6742ms)
▶ 4.6: most blogs
  ✔ returns the author with most blogs (1.3645ms)
✔ 4.6: most blogs (1.6995ms)
▶ 4.7: most likes
  ✔ returns the author with most total likes (2.0254ms)
✔ 4.7: most likes (2.5313ms)
ℹ tests 11
ℹ suites 7
ℹ pass 11
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 5800.5589


## Tarea 4.13 Expansión de la lista de blogs, STEP1

blog_api.tests.js:

´´´
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') 
const api = supertest(app)    

// Importamos el helper que contiene nuestros datos iniciales y funciones de apoyo
const helper = require('./test_helper')
const Blog = require('../models/blog')

describe('Pruebas de la API de blogs', () => {

  // SE APLICA A TODO EL ARCHIVO: Antes de cada test, vacía la DB e inserta los blogs iniciales
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  describe('Visualización de blogs (GET)', () => {
    
    test('4.8: los blogs se devuelven en formato json y en la cantidad correcta', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('4.9: el campo identificador único de los blogs se llama id', async () => {
      const response = await api.get('/api/blogs')
      const primerBlog = response.body[0]

      assert.ok(primerBlog.id)
      assert.strictEqual(primerBlog._id, undefined)
    })

  })

  describe('Adición de un nuevo blog (POST)', () => {

    test('4.10: un blog válido puede ser añadido correctamente', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const newBlog = {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2014/12/17/TheAnatomyOfAnAdvancedTDDSubtest.html",
        likes: 5
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201) 
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert(titles.includes("TDD harms architecture"))
    })

    test('4.11*: si la propiedad likes falta, se fijará en 0 por defecto', async () => {
      const newBlogWithoutLikes = {
        title: "Escribiendo código limpio sin esfuerzo",
        author: "Martin Fowler",
        url: "https://martinfowler.com/articles/injection.html"
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlogWithoutLikes)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 0)
    })

    test('4.12*: si falta el título o la url, el servidor responde con 400 Bad Request', async () => {
      const incompleteBlog = {
        author: "Anonymous",
        likes: 24
      }

      await api
        .post('/api/blogs')
        .send(incompleteBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

  })

  // CORREGIDO: Ahora el describe de DELETE está protegido dentro del bloque principal
  describe('Eliminación de un blog (DELETE)', () => {
    
    test('4.13: un blog puede ser eliminado si el id es válido', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogAEliminar = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogAEliminar.id}`)
        .expect(204) 

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert(!titles.includes(blogAEliminar.title))
    })

  })

  // AGREGADO: Bloque describe para la actualización (4.14*)
  describe('Actualización de un blog (PUT)', () => {

    test('4.14*: los likes de un blog pueden ser actualizados', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogAActualizar = blogsAtStart[0]

      const blogModificado = {
        title: blogAActualizar.title,
        author: blogAActualizar.author,
        url: blogAActualizar.url,
        likes: 100
      }

      const response = await api
        .put(`/api/blogs/${blogAActualizar.id}`)
        .send(blogModificado)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 100)

      const blogsAtEnd = await helper.blogsInDb()
      const blogComprobacion = blogsAtEnd.find(b => b.id === blogAActualizar.id)
      assert.strictEqual(blogComprobacion.likes, 100)
    })

  })

}) // <-- AQUÍ CIERRA EL DESCRIBE PRINCIPAL ('Pruebas de la API de blogs')

// Cierra la conexión de Mongoose al final de TODO el bloque de pruebas
after(async () => {
  await mongoose.connection.close()
})
´´´

blogs.js:

´´´
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// 4.8 y 4.9: GET de blogs usando async/await
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

// FUSIONADO (4.10, 4.11* y 4.12*): Una sola ruta POST con todas las reglas
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  // 1. Validación del paso 4.12*: Si falta título o URL, cortamos de inmediato
  if (!body.title || !body.url) {
    return response.status(400).end()
  }

  // 2. Creación del objeto (Paso 4.10 y 4.11* con default: 0 desde el modelo)
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes 
  })

  // 3. Guardado asíncrono
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

// 4.13: Ruta para eliminar un blog individual por su id
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end() // 204 No Content es el estándar para borrados exitosos
})

// 4.14*: Ruta para actualizar los datos (likes) de un blog por id
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  // { new: true } hace que 'updatedBlog' contenga el documento modificado con los nuevos likes
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true, context: 'query' })
  
  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter
´´´

Resultado:

PS C:\...\fullstackopen2026\part4\blog-list> npm test

> blog-list@1.0.0 test
> cross-env NODE_ENV=test node --test

Conectando a mongodb://...mongodb.net:27017/test_bloglistApp?ssl=true&replicaSet=atlas-tx04sx-shard-0&authSource=admin&retryWrites=true&w=majority
Conectado a MongoDB
▶ Pruebas de la API de blogs
  ▶ Visualización de blogs (GET)
    ✔ 4.8: los blogs se devuelven en formato json y en la cantidad correcta (2176.8072ms)
    ✔ 4.9: el campo identificador único de los blogs se llama id (346.6266ms)
  ✔ Visualización de blogs (GET) (2524.5776ms)
  ▶ Adición de un nuevo blog (POST)
    ✔ 4.10: un blog válido puede ser añadido correctamente (586.4928ms)
    ✔ 4.11*: si la propiedad likes falta, se fijará en 0 por defecto (361.7216ms)
    ✔ 4.12*: si falta el título o la url, el servidor responde con 400 Bad Request (350.4927ms)
  ✔ Adición de un nuevo blog (POST) (1299.2348ms)
  ▶ Eliminación de un blog (DELETE)
    ✔ 4.13: un blog puede ser eliminado si el id es válido (591.3052ms)
  ✔ Eliminación de un blog (DELETE) (591.6573ms)
  ▶ Actualización de un blog (PUT)
    ✔ 4.14*: los likes de un blog pueden ser actualizados (569.6211ms)
  ✔ Actualización de un blog (PUT) (569.9517ms)
✔ Pruebas de la API de blogs (4986.8484ms)
✔ 4.3: dummy returns one (2.3318ms)
▶ 4.4: total likes
  ✔ of a bigger list is calculated right (0.5364ms)
  ✔ of empty list is zero (0.3334ms)
✔ 4.4: total likes (1.4905ms)
▶ 4.5: favorite blog
  ✔ returns the blog with most likes (2.014ms)
✔ 4.5: favorite blog (2.4251ms)
▶ 4.6: most blogs
  ✔ returns the author with most blogs (1.3695ms)
✔ 4.6: most blogs (1.6437ms)
▶ 4.7: most likes
  ✔ returns the author with most total likes (1.0582ms)
✔ 4.7: most likes (1.333ms)
ℹ tests 13
ℹ suites 9
ℹ pass 13
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 6189.2642


## Tarea Extensión de la lista de blogs 4.14*, Paso 2

blogs.js:

´´´
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// 4.8 y 4.9: GET de blogs usando async/await
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

// FUSIONADO (4.10, 4.11* y 4.12*): Una sola ruta POST con todas las reglas
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  // 1. Validación del paso 4.12*: Si falta título o URL, cortamos de inmediato
  if (!body.title || !body.url) {
    return response.status(400).end()
  }

  // 2. Creación del objeto (Paso 4.10 y 4.11* con default: 0 desde el modelo)
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes 
  })

  // 3. Guardado asíncrono
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

// 4.13: Ruta para eliminar un blog individual por su id
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end() // 204 No Content es el estándar para borrados exitosos
})

// 4.14*: Ruta para actualizar los datos (likes) de un blog por id (UNA SOLA VEZ)
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  // { new: true } hace que 'updatedBlog' contenga el documento modificado con los nuevos likes
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id, 
    blog, 
    { new: true, runValidators: true, context: 'query' }
  )
  
  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter
´´´

blog_api.tests.js:

´´´
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') 
const api = supertest(app)    

// Importamos el helper que contiene nuestros datos iniciales y funciones de apoyo
const helper = require('./test_helper')
const Blog = require('../models/blog')

describe('Pruebas de la API de blogs', () => {

  // SE APLICA A TODO EL ARCHIVO: Antes de cada test, vacía la DB e inserta los blogs iniciales
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  describe('Visualización de blogs (GET)', () => {
    
    test('4.8: los blogs se devuelven en formato json y en la cantidad correcta', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('4.9: el campo identificador único de los blogs se llama id', async () => {
      const response = await api.get('/api/blogs')
      const primerBlog = response.body[0]

      assert.ok(primerBlog.id)
      assert.strictEqual(primerBlog._id, undefined)
    })

  })

  describe('Adición de un nuevo blog (POST)', () => {

    test('4.10: un blog válido puede ser añadido correctamente', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const newBlog = {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2014/12/17/TheAnatomyOfAnAdvancedTDDSubtest.html",
        likes: 5
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201) 
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert(titles.includes("TDD harms architecture"))
    })

    test('4.11*: si la propiedad likes falta, se fijará en 0 por defecto', async () => {
      const newBlogWithoutLikes = {
        title: "Escribiendo código limpio sin esfuerzo",
        author: "Martin Fowler",
        url: "https://martinfowler.com/articles/injection.html"
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlogWithoutLikes)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 0)
    })

    test('4.12*: si falta el título o la url, el servidor responde con 400 Bad Request', async () => {
      const incompleteBlog = {
        author: "Anonymous",
        likes: 24
      }

      await api
        .post('/api/blogs')
        .send(incompleteBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

  })

  describe('Eliminación de un blog (DELETE)', () => {
    
    test('4.13: un blog puede ser eliminado si el id es válido', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogAEliminar = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogAEliminar.id}`)
        .expect(204) 

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert(!titles.includes(blogAEliminar.title))
    })

  })

  describe('Actualización de un blog (PUT)', () => {

    // CORREGIDO: Se mantiene una única instancia de este test bien anidado
    test('4.14*: los likes de un blog pueden ser actualizados', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogAActualizar = blogsAtStart[0]

      const blogModificado = {
        title: blogAActualizar.title,
        author: blogAActualizar.author,
        url: blogAActualizar.url,
        likes: 100
      }

      const response = await api
        .put(`/api/blogs/${blogAActualizar.id}`)
        .send(blogModificado)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 100)

      const blogsAtEnd = await helper.blogsInDb()
      const blogComprobacion = blogsAtEnd.find(b => b.id === blogAActualizar.id)
      assert.strictEqual(blogComprobacion.likes, 100)
    })

  })

}) // <-- Cierre del describe principal

// Cierra la conexión de Mongoose al final de TODO el bloque de pruebas
after(async () => {
  await mongoose.connection.close()
})
´´´

Resultado:

PS C:\...\fullstackopen2026\part4\blog-list> npm test

> blog-list@1.0.0 test
> cross-env NODE_ENV=test node --test

Conectando a mongodb://...mongodb.net:27017/test_bloglistApp?ssl=true&replicaSet=atlas-tx04sx-shard-0&authSource=admin&retryWrites=true&w=majority
Conectado a MongoDB
▶ Pruebas de la API de blogs
  ▶ Visualización de blogs (GET)
    ✔ 4.8: los blogs se devuelven en formato json y en la cantidad correcta (1973.1125ms)
    ✔ 4.9: el campo identificador único de los blogs se llama id (346.4947ms)
  ✔ Visualización de blogs (GET) (2320.9052ms)
  ▶ Adición de un nuevo blog (POST)
    ✔ 4.10: un blog válido puede ser añadido correctamente (576.9142ms)
    ✔ 4.11*: si la propiedad likes falta, se fijará en 0 por defecto (349.2877ms)
    ✔ 4.12*: si falta el título o la url, el servidor responde con 400 Bad Request (338.8807ms)
  ✔ Adición de un nuevo blog (POST) (1265.5799ms)
  ▶ Eliminación de un blog (DELETE)
    ✔ 4.13: un blog puede ser eliminado si el id es válido (559.0333ms)
  ✔ Eliminación de un blog (DELETE) (559.3123ms)
  ▶ Actualización de un blog (PUT)
    ✔ 4.14*: los likes de un blog pueden ser actualizados (578.0101ms)
  ✔ Actualización de un blog (PUT) (578.2441ms)
✔ Pruebas de la API de blogs (4725.3663ms)
✔ 4.3: dummy returns one (1.1297ms)
▶ 4.4: total likes
  ✔ of a bigger list is calculated right (0.2881ms)
  ✔ of empty list is zero (0.1861ms)
✔ 4.4: total likes (0.8377ms)
▶ 4.5: favorite blog
  ✔ returns the blog with most likes (1.1912ms)
✔ 4.5: favorite blog (1.4809ms)
▶ 4.6: most blogs
  ✔ returns the author with most blogs (1.1032ms)
✔ 4.6: most blogs (1.3923ms)
▶ 4.7: most likes
  ✔ returns the author with most total likes (1.972ms)
✔ 4.7: most likes (2.3837ms)
ℹ tests 13
ℹ suites 9
ℹ pass 13
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 5522.4086

## Tarea 4.15: Expansión de la lista de blogs, paso 3

user.js:

´´´
[
  {
    "username": "mluukkai",
    "name": "Matti Luukkainen",
    "id": "6a08fd1a2a23847738d774e0"
  }
]
´´´


users.js:

´´´
const usersRouter = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user')

// GET /api/users - Muestra la lista de usuarios tal como se ve en tu captura
usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

// POST /api/users - Registra un nuevo usuario encriptando su contraseña
usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if (!username || !password) {
    return response.status(400).json({ error: 'username and password are required' })
    }

  // Cifrado asíncrono seguro de la contraseña
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
    username,
    name,
    passwordHash
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

module.exports = usersRouter
´´´

app.js:

´´´
const config = require('./utils/config')
const express = require('express')
require('express-async-errors') // Elimina la necesidad de bloques try-catch en controladores
const app = express() 
const cors = require('cors')

// 1. Importación de Controladores
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
// const loginRouter = require('./controllers/login') // Descoméntala en el paso 4.18

// 2. Importación de Middlewares y utilidades
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

// Configuración de la conexión a MongoDB
mongoose.set('strictQuery', false)
logger.info('Conectando a', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
    logger.info('Conectado a MongoDB')
    })
    .catch((error) => {
    logger.error('Error conectando a MongoDB:', error.message)
    })

// 3. Middlewares Globales Iniciales
app.use(cors())
app.use(express.json()) // Hace que request.body no llegue como undefined
app.use(middleware.requestLogger) // Logger de peticiones entrantes

// 4. Registro de Rutas de la API
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

// 5. Middlewares de Cierre (Manejo de rutas inexistentes y errores)
app.use(middleware.unknownEndpoint) 
app.use(middleware.errorHandler)

module.exports = app
´´´

logger.js:

´´´
const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') { 
    console.log(...params)
    }
}

const error = (...params) => {
    if (process.env.NODE_ENV !== 'test') { 
    console.error(...params)
    }
}

module.exports = {
    info,
    error
}
´´´

middleware.js:

´´´
const logger = require('./logger')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
    }

    next(error)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}
´´´

blog.js:

´´´
const mongoose = require('mongoose')

// FUSIONADO (4.9, 4.11* y 4.17): Un solo esquema con todas las propiedades unificadas
const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: { 
    type: Number, 
    default: 0 // <-- Solución al 4.11*
    },
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // <-- 4.17: Vinculación relacional con el modelo de Usuario
    }
})

// Modificamos el método toJSON una sola vez para formatear la salida de los datos
blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() // <-- Solución al 4.9
    delete returnedObject._id
    delete returnedObject.__v
    }
})

// Exportamos el modelo una sola vez al final del archivo
module.exports = mongoose.model('Blog', blogSchema)
´´´

usuarios.rest:

´´´
### Obtener todos los usuarios inicialmente (Debe devolver un arreglo vacío [])
GET http://localhost:3003/api/users

###

### Crear un nuevo usuario (Ejercicio 4.15)
POST http://localhost:3003/api/users
Content-Type: application/json

{
    "username": "hellas",
    "name": "Arto Hellas",
    "password": "unacontrasenasegura"
}

###

### Crear otro usuario para pruebas futuras
POST http://localhost:3003/api/users
Content-Type: application/json

{
    "username": "mluukkai",
    "name": "Matti Luukkainen",
    "password": "otraclavesegura"
}
´´´

En la terminal:

´´´
Restarting 'index.js'
Conectando a mongodb://...mongodb.net:27017/bloglistApp?ssl=true&replicaSet=atlas-tx04sx-shard-0&authSource=admin&retryWrites=true&w=majority
Servidor corriendo en el puerto 3003
Conectado a MongoDB
Method: POST
Path:   /api/users
Body:   {
  username: 'mluukkai',
  name: 'Matti Luukkainen',
  password: 'otraclavesegura'
}
---
Method: GET
Path:   /api/users
Body:   {}
---
Method: POST
Path:   /api/users
Body:   {
  username: 'hellas',
  name: 'Arto Hellas',
  password: 'unacontrasenasegura'
}
---
Method: GET
Path:   /api/users
Body:   {}
---
´´´

http://localhost:3003/api/users:
[
  {
    "username": "mluukkai",
    "name": "Matti Luukkainen",
    "id": "6a08fd1a2a23847738d774e0"
  },
  {
    "username": "hellas",
    "name": "Arto Hellas",
    "id": "6a090b322a23847738d774e3"
  }
]


## Tarea 4.16*: Expansión de la lista de blogs, paso 4
users.js:

´´´
const usersRouter = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user')

// GET /api/users - Obtener todos los usuarios de la base de datos
usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

// POST /api/users - Creación con las validaciones estrictas exigidas en 4.16*
usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

  // 1. Validar longitud mínima y presencia del username
    if (!username || username.length < 3) {
    return response.status(400).json({ 
        error: 'username must be at least 3 characters long and required' 
    })
    }

  // 2. Validar longitud mínima y presencia de la contraseña (en el controlador)
    if (!password || password.length < 3) {
    return response.status(400).json({ 
        error: 'password must be at least 3 characters long and required' 
    })
    }

  // 3. Generar el Hash seguro con bcryptjs solo si pasa los filtros anteriores
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
    username,
    name,
    passwordHash
    })

  // 4. Guardar en MongoDB (Mongoose manejará el error único si el username ya existe)
    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

module.exports = usersRouter
´´´


blog_api.test.js:

´´´
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const bcrypt = require('bcryptjs')

describe('Pruebas de la API de usuarios (4.16*)', () => {
  
  // Limpiamos la base de datos de pruebas e insertamos un usuario inicial
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secretpass', 10)
    const user = new User({ 
      username: 'root', 
      name: 'Superuser', 
      passwordHash 
    })
    await user.save()
  })

  test('falla con 400 Bad Request si el username tiene menos de 3 caracteres', async () => {
    const usuariosAlInicio = await User.find({})

    const newUser = {
      username: 'ed', // Muy corto (inválido)
      name: 'Eduardo',
      password: 'passwordvalido'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    // Validamos que el mensaje devuelto sea razonable
    assert.ok(response.body.error.includes('username must be at least 3 characters long'))

    // Aseguramos que NO se haya creado en la base de datos
    const usuariosAlFinal = await User.find({})
    assert.strictEqual(usuariosAlFinal.length, usuariosAlInicio.length)
  })

  test('falla con 400 Bad Request si la contraseña tiene menos de 3 caracteres', async () => {
    const usuariosAlInicio = await User.find({})

    const newUser = {
      username: 'usuario_valido',
      name: 'Test Name',
      password: '12' // Muy corta (inválida)
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.ok(response.body.error.includes('password must be at least 3 characters long'))

    const usuariosAlFinal = await User.find({})
    assert.strictEqual(usuariosAlFinal.length, usuariosAlInicio.length)
  })

  test('falla con 400 Bad Request si el username ya está duplicado', async () => {
    const usuariosAlInicio = await User.find({})

    const duplicateUser = {
      username: 'root', // Ya existe en el beforeEach
      name: 'Otro Root',
      password: 'passwordseguro'
    }

    const response = await api
      .post('/api/users')
      .send(duplicateUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.ok(response.body.error.includes('expected `username` to be unique'))

    const usuariosAlFinal = await User.find({})
    assert.strictEqual(usuariosAlFinal.length, usuariosAlInicio.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
´´´

package.json:

´´´
{
  "name": "blog-list",
  "version": "1.0.0",
  "description": "Aplicación de lista de blogs - FullStackOpen Parte 4",
  "main": "index.js",
  "scripts": {
  "start": "node index.js",
  "dev": "cross-env NODE_ENV=development node --watch index.js",
  "test": "cross-env NODE_ENV=test node --test --test-concurrency=1"
},
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-async-errors": "^3.1.1",
    "lodash": "^4.18.1",
    "mongoose": "^8.4.1"
  },
  "devDependencies": {
    "cross-env": "^10.1.0",
    "supertest": "^7.2.2"
  }
}
´´´

Resultado:

PS C:\...\fullstackopen2026\part4\blog-list> npm test   

> blog-list@1.0.0 test
> cross-env NODE_ENV=test node --test --test-concurrency=1

▶ Pruebas de la API de usuarios (4.16*)
  ✔ falla con 400 Bad Request si el username tiene menos de 3 caracteres (2214.4332ms)
  ✔ falla con 400 Bad Request si la contraseña tiene menos de 3 caracteres (576.0438ms)
  ✔ falla con 400 Bad Request si el username ya está duplicado (760.0673ms)
✔ Pruebas de la API de usuarios (4.16*) (3553.0997ms)
✔ 4.3: dummy returns one (1.0607ms)
▶ 4.4: total likes
  ✔ of a bigger list is calculated right (0.2234ms)
  ✔ of empty list is zero (0.1832ms)
✔ 4.4: total likes (0.7666ms)
▶ 4.5: favorite blog
  ✔ returns the blog with most likes (3.1207ms)
✔ 4.5: favorite blog (3.3489ms)
▶ 4.6: most blogs
  ✔ returns the author with most blogs (0.7139ms)
✔ 4.6: most blogs (0.9259ms)
▶ 4.7: most likes
  ✔ returns the author with most total likes (1.0156ms)
✔ 4.7: most likes (1.355ms)
ℹ tests 9
ℹ suites 5
ℹ pass 9
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 4350.3268

## Tarea 4.17: Expansión de la lista de blogs, Paso 5
blog.js:

´´´
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
´´´

blogs.js:

´´´
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// GET /api/blogs - Lista blogs expandiendo la información del creador
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

// POST /api/blogs - SOLO UNO, configurado temporalmente para el segundo usuario
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const users = await User.find({})
  const user = users[1] // <-- Apunta a hellas

  if (!user) {
    return response.status(400).json({ error: 'No existe el segundo usuario en la base de datos' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id 
  })

  const savedBlog = await blog.save()

  // Protección anticaídas por si no tiene el array inicializado en Atlas
  user.blogs = (user.blogs || []).concat(savedBlog.id)
  await user.save()

  response.status(201).json(savedBlog)
})

module.exports = blogsRouter
´´´

users.js:

´´´
const usersRouter = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user')

// GET /api/users - Lista usuarios mostrando sus blogs añadidos (Imagen 3)
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { url: 1, title: 1, author: 1 }) // Cruza colecciones de forma inversa

  response.json(users)
})

// POST /api/users - Permanece exactamente igual que en el 4.16*
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!username || username.length < 3) {
    return response.status(400).json({ error: 'username must be at least 3 characters long and required' })
  }
  if (!password || password.length < 3) {
    return response.status(400).json({ error: 'password must be at least 3 characters long and required' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter
´´´

blog.rest:

´´´
POST http://localhost:3003/api/blogs
Content-Type: application/json

{
    "title": "Things I Don't Know as of 2018",
    "author": "Dan Abramov",
    "url": "https://overreacted.io/things-i-dont-know-as-of-2018/",
    "likes": 8
}

###

POST http://localhost:3003/api/blogs
Content-Type: application/json

{
    "title": "Microservices and the First Law of Distributed Objects",
    "author": "Martin Fowler",
    "url": "https://martinfowler.com/articles/distributed-objects-microservices.html",
    "likes": 5
}
´´´

http://localhost:3003/api/blogs:

[
  {
    "title": "Things I Don't Know as of 2018",
    "author": "Dan Abramov",
    "url": "https://overreacted.io/things-i-dont-know-as-of-2018/",
    "likes": 8,
    "user": {
      "username": "mluukkai",
      "name": "Matti Luukkainen",
      "id": "6a08fd1a2a23847738d774e0"
    },
    "id": "6a0914a397b44e5976c92094"
  },
  {
    "title": "Microservices and the First Law of Distributed Objects",
    "author": "Martin Fowler",
    "url": "https://martinfowler.com/articles/distributed-objects-microservices.html",
    "likes": 5,
    "user": {
      "username": "hellas",
      "name": "Arto Hellas",
      "id": "6a090b322a23847738d774e3"
    },
    "id": "6a091862d0b0ce73a6c481fd"
  }
]

## Tarea 4.18: Expansión de la lista de blogs, Paso 6
Se guardan las claves en .env

login.js:
´´´
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

  // 1. Buscar al usuario en la base de datos
    const user = await User.findOne({ username })

  // 2. Verificar la contraseña usando bcrypt
    const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  // 3. Si no existe el usuario o la contraseña es incorrecta, rechazar
    if (!(user && passwordCorrect)) {
    return response.status(401).json({
        error: 'invalid username or password'
    })
    }

  // 4. Estructurar los datos que viajan cifrados dentro del token (Payload)
    const userForToken = {
    username: user.username,
    id: user._id,
    }

  // 5. Firmar el token digitalmente usando la clave secreta del .env
    const token = jwt.sign(
    userForToken, 
    process.env.SECRET,
    { expiresIn: 60 * 60 } // El token expira en 1 hora (opcional pero recomendado)
    )

  // 6. Responder con el token y los datos públicos del usuario
    response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
´´´

app.js:

´´´
const config = require('./utils/config')
const express = require('express')
require('express-async-errors') // Elimina la necesidad de bloques try-catch en controladores
const app = express() 
const cors = require('cors')

// 1. Importación de Controladores
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login') // <-- DESCOMENTADA Y ACTIVADA (4.18)

// 2. Importación de Middlewares y utilidades
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

// Configuración de la conexión a MongoDB
mongoose.set('strictQuery', false)
logger.info('Conectando a', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
    logger.info('Conectado a MongoDB')
    })
    .catch((error) => {
    logger.error('Error conectando a MongoDB:', error.message)
    })

// 3. Middlewares Globales Iniciales
app.use(cors())
app.use(express.json()) // Hace que request.body no llegue como undefined
app.use(middleware.requestLogger) // Logger de peticiones entrantes

// 4. Registro de Rutas de la API (El orden importa: login arriba)
app.use('/api/login', loginRouter) // <-- ACTIVADA PARA EL PASO 4.18
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

// 5. Middlewares de Cierre (Manejo de rutas inexistentes y errores)
app.use(middleware.unknownEndpoint) 
app.use(middleware.errorHandler)

module.exports = app
´´´

login.rest:

´´´
POST http://localhost:3003/api/login
Content-Type: application/json

{
    "username": "mluukkai",
    "password": "otraclavesegura"
}

Respuesta:
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 260
ETag: W/"104-wlvoLZNA6kDXYR8gH7r+J2e7ZQI"
Date: Sun, 17 May 2026 20:46:59 GMT
Connection: close

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1sdXVra2FpIiwiaWQiOiI2YTA4ZmQxYTJhMjM4NDc3MzhkNzc0ZTAiLCJpYXQiOjE3NzkwNTA4MTksImV4cCI6MTc3OTA1NDQxOX0.-UDUoNcZuvv7Y1Pf4uO4bUdV8NUEv5_9s2AykciyucY",
  "username": "mluukkai",
  "name": "Matti Luukkainen"
}
´´´

## Tarea 4.19: Expansión de la lista de blogs, Paso 7
blogs.js:

´´´
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// Función auxiliar para aislar el token de la cabecera Authorization
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

// GET /api/blogs - Lista blogs expandiendo la información del creador
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

// POST /api/blogs - Ahora protegido por Token JWT
blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const token = getTokenFrom(request)

  // 1. Verificar el token digitalmente usando la clave secreta
  const decodedToken = jwt.verify(token, process.env.SECRET)
  
  // 2. Validar que el token sea correcto y tenga un ID de usuario
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  // 3. Buscar al usuario exacto usando el ID guardado dentro del token
  const user = await User.findById(decodedToken.id)
  if (!user) {
    return response.status(404).json({ error: 'user not found' })
  }

  // 4. Crear el blog asociándolo a la ID de ese usuario real
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id
  })

  const savedBlog = await blog.save()

  // 5. Guardar la ID del blog en el arreglo del usuario
  user.blogs = (user.blogs || []).concat(savedBlog.id)
  await user.save()

  response.status(201).json(savedBlog)
})

// La exportación única SIEMPRE al final del archivo
module.exports = blogsRouter
´´´

middleware.js:

´´´
const logger = require('./logger')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') { // <-- AGREGA ESTO
    return response.status(401).json({ error: 'token missing or invalid' })
  } else if (error.name === 'TokenExpiredError') { // <-- AGREGA ESTO
    return response.status(401).json({ error: 'token expired' })
    }

    next(error)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}
´´´

blog.rest:

´´´
POST http://localhost:3003/api/blogs
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1sdXVra2FpIiwiaWQiOiI2YTA4ZmQxYTJhMjM4NDc3MzhkNzc0ZTAiLCJpYXQiOjE3NzkwNTA4MTksImV4cCI6MTc3OTA1NDQxOX0.-UDUoNcZuvv7Y1Pf4uO4bUdV8NUEv5_9s2AykciyucY

{
    "title": "Prueba de Blog Autenticado",
    "author": "Matti Luukkainen",
    "url": "https://fullstackopen.com/",
    "likes": 12
}

Respuesta:
HTTP/1.1 201 Created
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 178
ETag: W/"b2-OnSIpcPXn3yN3x5vjllsSMZJ95k"
Date: Sun, 17 May 2026 21:08:50 GMT
Connection: close

{
  "title": "Prueba de Blog Autenticado",
  "author": "Matti Luukkainen",
  "url": "https://fullstackopen.com/",
  "likes": 12,
  "user": "6a08fd1a2a23847738d774e0",
  "id": "6a0a2e6157d61f935e9fded0"
}
´´´

## Tarea 4.20*: Expansión de la lista de blogs, Paso 8
blogs.js:

´´´
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// GET /api/blogs - Lista blogs expandiendo la información del creador
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

// POST /api/blogs - REFACTORIZADO Y LIMPIO (Usa request.token del middleware)
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  // 1. Verificar el token usando request.token que inyectó nuestro middleware global
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  // 2. Buscar al usuario exacto usando el ID extraído del token
  const user = await User.findById(decodedToken.id)
  if (!user) {
    return response.status(404).json({ error: 'user not found' })
  }

  // 3. Crear el blog asociándolo a ese usuario real
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id
  })

  const savedBlog = await blog.save()

  // 4. Guardar la ID del blog en el arreglo del usuario correspondientemente
  user.blogs = (user.blogs || []).concat(savedBlog.id)
  await user.save()

  response.status(201).json(savedBlog)
})

// La exportación única SIEMPRE en la última línea del archivo
module.exports = blogsRouter
´´´

middleware.js:

´´´
const logger = require('./logger')

// 1. Logger de peticiones entrantes
const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

// 2. NUEVO MIDDLEWARE: Extrae el token y lo guarda en request.token
const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    
    if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
    } else {
    request.token = null
    }

    next()
}

// 3. Manejador para rutas inexistentes
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// 4. Manejador de errores global (Centraliza las excepciones)
const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') { 
    return response.status(401).json({ error: 'token missing or invalid' })
    } else if (error.name === 'TokenExpiredError') { 
    return response.status(401).json({ error: 'token expired' })
    }

    next(error)
}

// UNA ÚNICA EXPORTACIÓN con las 4 funciones dentro
module.exports = {
    requestLogger,
    tokenExtractor,
    unknownEndpoint,
    errorHandler
}
´´´

app.js:

´´´
const config = require('./utils/config')
const express = require('express')
require('express-async-errors') // Elimina la necesidad de bloques try-catch en controladores
const app = express() 
const cors = require('cors')

// 1. Importación de Controladores
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login') // <-- DESCOMENTADA Y ACTIVADA (4.18)

// 2. Importación de Middlewares y utilidades
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

// Configuración de la conexión a MongoDB
mongoose.set('strictQuery', false)
logger.info('Conectando a', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
    logger.info('Conectado a MongoDB')
    })
    .catch((error) => {
    logger.error('Error conectando a MongoDB:', error.message)
    })

// 3. Middlewares Globales Iniciales
app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor) // <-- ¡REGÍSTRALO AQUÍ!

// 4. Registro de Rutas de la API (El orden importa: login arriba)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

// 5. Middlewares de Cierre (Manejo de rutas inexistentes y errores)
app.use(middleware.unknownEndpoint) 
app.use(middleware.errorHandler)

module.exports = app
´´´

blog.rest:

´´´
POST http://localhost:3003/api/blogs
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1sdXVra2FpIiwiaWQiOiI2YTA4ZmQxYTJhMjM4NDc3MzhkNzc0ZTAiLCJpYXQiOjE3NzkwNTA4MTksImV4cCI6MTc3OTA1NDQxOX0.-UDUoNcZuvv7Y1Pf4uO4bUdV8NUEv5_9s2AykciyucY

{
    "title": "Prueba de Blog Autenticado",
    "author": "Matti Luukkainen",
    "url": "https://fullstackopen.com/",
    "likes": 12
}

Respuesta:
HTTP/1.1 201 Created
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 178
ETag: W/"b2-RYHsC18bbzRV+HiqtPIm3pRM/FQ"
Date: Sun, 17 May 2026 21:34:48 GMT
Connection: close

{
  "title": "Prueba de Blog Autenticado",
  "author": "Matti Luukkainen",
  "url": "https://fullstackopen.com/",
  "likes": 12,
  "user": "6a08fd1a2a23847738d774e0",
  "id": "6a0a3478155f3ecec1ca1c43"
}
´´´

## Tarea 4.21*: Expansión de la lista de blogs, Paso 9
blogs.js:

´´´
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// GET /api/blogs - Lista blogs expandiendo la información del creador
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

// POST /api/blogs - REFACTORIZADO Y LIMPIO (Usa request.token del middleware)
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  // 1. Verificar el token usando request.token que inyectó nuestro middleware global
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  // 2. Buscar al usuario exacto usando el ID extraído del token
  const user = await User.findById(decodedToken.id)
  if (!user) {
    return response.status(404).json({ error: 'user not found' })
  }

  // 3. Crear el blog asociándolo a ese usuario real
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id
  })

  const savedBlog = await blog.save()

  // 4. Guardar la ID del blog en el arreglo del usuario correspondientemente
  user.blogs = (user.blogs || []).concat(savedBlog.id)
  await user.save()

  response.status(201).json(savedBlog)
})

// DELETE /api/blogs/:id - Eliminar un blog (Solo permitido para el creador)
blogsRouter.delete('/:id', async (request, response) => {
  // 1. Extraer y verificar el token usando el middleware global
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  // 2. Buscar el blog que se intenta eliminar en la base de datos
  const blog = await Blog.findById(request.params.id)
  
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  // 3. COMPARACIÓN CRÍTICA: ¿El usuario del token es el mismo que creó el blog?
  if (blog.user.toString() !== decodedToken.id.toString()) {
    return response.status(403).json({ 
      error: 'only the creator can delete this blog' 
    })
  }

  // 4. Si pasa la validación, se elimina de la base de datos
  await Blog.findByIdAndDelete(request.params.id)
  
  // 5. Responder con 204 No Content (Corregido de 24 a 204)
  response.status(204).end()
})

module.exports = blogsRouter
´´´

blog.rest:

´´´
POST http://localhost:3003/api/blogs
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1sdXVra2FpIiwiaWQiOiI2YTA4ZmQxYTJhMjM4NDc3MzhkNzc0ZTAiLCJpYXQiOjE3NzkwNTA4MTksImV4cCI6MTc3OTA1NDQxOX0.-UDUoNcZuvv7Y1Pf4uO4bUdV8NUEv5_9s2AykciyucY

{
    "title": "Prueba de Blog Autenticado",
    "author": "Matti Luukkainen",
    "url": "https://fullstackopen.com/",
    "likes": 12
}
´´´

Respuesta:

Conectando a mongodb://...mongodb.net:27017/bloglistApp?ssl=true&replicaSet=atlas-tx04sx-shard-0&authSource=admin&retryWrites=true&w=majority
Servidor corriendo en el puerto 3003
Conectado a MongoDB
Method: POST
Path:   /api/blogs
Body:   {
  title: 'Microservices and the First Law of Distributed Objects',
  author: 'Martin Fowler',
  url: 'https://martinfowler.com/articles/distributed-objects-microservices.html',
  likes: 5
}
---
jwt must be provided

## Tarea 4.22*: Expansión de la lista de blogs, Paso 10
middleware.js:
const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

// 1. Logger de peticiones entrantes
const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

// 2. Extractor de Token (¡Mantenlo aquí, lo necesitas!)
const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    
    if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
    } else {
    request.token = null
    }

    next()
}

// 3. Extractor de Usuario (Usa el request.token que dejó el paso anterior)
const userExtractor = async (request, response, next) => {
    if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (decodedToken.id) {
        request.user = await User.findById(decodedToken.id)
    }
    }
    
    next()
}

// 4. Manejador para rutas inexistentes
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// 5. Manejador de errores global
const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') { 
    return response.status(401).json({ error: 'token missing or invalid' })
    } else if (error.name === 'TokenExpiredError') { 
    return response.status(401).json({ error: 'token expired' })
    }

    next(error)
}

// Exportación única y correcta de las 5 funciones
module.exports = {
    requestLogger,
    tokenExtractor,
    userExtractor,
    unknownEndpoint,
    errorHandler
}

blogs.js:
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware') // <-- Única importación del extractor

// 1. GET /api/blogs - Sigue siendo público (No requiere token ni usa userExtractor)
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

// 2. POST /api/blogs - PROTEGIDO (Usa userExtractor)
blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user // <-- Inyectado automáticamente por el middleware

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id
  })

  const savedBlog = await blog.save()

  user.blogs = (user.blogs || []).concat(savedBlog.id)
  await user.save()

  response.status(201).json(savedBlog)
})

// 3. DELETE /api/blogs/:id - PROTEGIDO (Usa userExtractor)
blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user // <-- Inyectado automáticamente por el middleware

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(request.params.id)
  
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  // Comparación limpia usando el user.id que ya extrajo el middleware
  if (blog.user.toString() !== user.id.toString()) {
    return response.status(403).json({ 
      error: 'only the creator can delete this blog' 
    })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter

blog.rest:

DELETE http://localhost:3003/api/blogs/6a0a3478155f3ecec1ca1c43
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1sdXVra2FpIiwiaWQiOiI2YTA4ZmQxYTJhMjM4NDc3MzhkNzc0ZTAiLCJpYXQiOjE3NzkwNTczMTR9.A2_YwG6awjpNX8rBVOa882RnVW_9eDEcTRS7n16UNns

Respuesta:
HTTP/1.1 204 No Content
X-Powered-By: Express
Access-Control-Allow-Origin: *
Date: Sun, 17 May 2026 22:37:29 GMT
Connection: 

Method: DELETE
Path:   /api/blogs/6a0a3478155f3ecec1ca1c43
Body:   {}
---
Method: GET
Path:   /api/blogs
Body:   {}

## Tarea 4.23*: Expansión de la lista de blogs, Paso 11
blog_api.test.js:

´´´
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

let token // Aquí guardaremos el token para las pruebas de blogs

// ==========================================
// SECCIÓN 1: PRUEBAS DE USUARIOS (4.16*)
// ==========================================
describe('Pruebas de la API de usuarios (4.16*)', () => {
  
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secretpass', 10)
    const user = new User({ 
      username: 'root', 
      name: 'Superuser', 
      passwordHash 
    })
    await user.save()
  })

  test('falla con 400 Bad Request si el username tiene menos de 3 caracteres', async () => {
    const usuariosAlInicio = await User.find({})

    const newUser = {
      username: 'ed',
      name: 'Eduardo',
      password: 'passwordvalido'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.ok(response.body.error.includes('username must be at least 3 characters long'))

    const usuariosAlFinal = await User.find({})
    assert.strictEqual(usuariosAlFinal.length, usuariosAlInicio.length)
  })

  test('falla con 400 Bad Request si la contraseña tiene menos de 3 caracteres', async () => {
    const usuariosAlInicio = await User.find({})

    const newUser = {
      username: 'usuario_valido',
      name: 'Test Name',
      password: '12'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.ok(response.body.error.includes('password must be at least 3 characters long'))

    const usuariosAlFinal = await User.find({})
    assert.strictEqual(usuariosAlFinal.length, usuariosAlInicio.length)
  })

  test('falla con 400 Bad Request si el username ya está duplicado', async () => {
    const usuariosAlInicio = await User.find({})

    const duplicateUser = {
      username: 'root',
      name: 'Otro Root',
      password: 'passwordseguro'
    }

    const response = await api
      .post('/api/users')
      .send(duplicateUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.ok(response.body.error.includes('expected `username` to be unique'))

    const usuariosAlFinal = await User.find({})
    assert.strictEqual(usuariosAlFinal.length, usuariosAlInicio.length)
  })
})

// ==========================================
// SECCIÓN 2: PRUEBAS DE BLOGS Y TOKENS (4.23*)
// ==========================================
describe('Pruebas de la API de blogs con autenticación (4.23*)', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    // 1. Crear el usuario para las pruebas de blogs
    const passwordHash = await bcrypt.hash('secretpassword', 10)
    const user = new User({ 
      username: 'testuser', 
      name: 'Test User', 
      passwordHash 
    })
    await user.save()

    // 2. Loguearse para extraer un token fresco
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testuser', password: 'secretpassword' })

    token = loginResponse.body.token
  })

  test('un blog válido puede ser añadido con un token válido', async () => {
    const newBlog = {
      title: 'Async/Await simplified',
      author: 'John Doe',
      url: 'https://example.com/async-await',
      likes: 4
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert.ok(titles.includes('Async/Await simplified'))
  })

  test('falla con código 401 Unauthorized si no se provee un token', async () => {
    const newBlog = {
      title: 'Unauthorised Blog Attempt',
      author: 'Hacker',
      url: 'https://example.com/hack',
      likes: 0
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'token missing or invalid')

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, 0)
  })
})

// Cierre global de la conexión
after(async () => {
  await mongoose.connection.close()
})
´´´

middleware.js:

´´´
const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

// 1. Logger de peticiones entrantes
const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

// 2. Extractor de Token (¡Mantenlo aquí, lo necesitas!)
const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    
    if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
    } else {
    request.token = null
    }

    next()
}

// 3. Extractor de Usuario (Usa el request.token que dejó el paso anterior)
const userExtractor = async (request, response, next) => {
    if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (decodedToken.id) {
        request.user = await User.findById(decodedToken.id)
    }
    }
    
    next()
}

// 4. Manejador para rutas inexistentes
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// 5. Manejador de errores global
// utils/middleware.js

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') { 
    return response.status(401).json({ error: 'token missing or invalid' })
    } else if (error.name === 'TokenExpiredError') { 
    return response.status(401).json({ error: 'token expired' })
    } 
    
  // NUEVO VALIDADOR: Atrapa errores de duplicación en MongoDB (Código 11000)
    else if (error.name === 'MongoServerError' && error.message.includes('E11000')) {
    return response.status(400).json({ 
        error: 'expected `username` to be unique' 
    })
    }

    next(error)
}

// Exportación única y correcta de las 5 funciones
module.exports = {
    requestLogger,
    tokenExtractor,
    userExtractor,
    unknownEndpoint,
    errorHandler
}
´´´

Respuesta:

PS C:\...\fullstackopen2026\part4\blog-list> npm test -- tests/blog_api.test.js

> blog-list@1.0.0 test
> cross-env NODE_ENV=test node --test --test-concurrency=1 tests/blog_api.test.js

▶ Pruebas de la API de usuarios (4.16*)
  ✔ falla con 400 Bad Request si el username tiene menos de 3 caracteres (2512.9814ms)
  ✔ falla con 400 Bad Request si la contraseña tiene menos de 3 caracteres (918.1617ms)
  ✔ falla con 400 Bad Request si el username ya está duplicado (1323.9374ms)
✔ Pruebas de la API de usuarios (4.16*) (4759.0796ms)
▶ Pruebas de la API de blogs con autenticación (4.23*)
  ✔ un blog válido puede ser añadido con un token válido (1958.9547ms)
  ✔ falla con código 401 Unauthorized si no se provee un token (1149.8984ms)
✔ Pruebas de la API de blogs con autenticación (4.23*) (3110.0602ms)
ℹ tests 5
ℹ suites 2
ℹ pass 5
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 9152.5281

