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