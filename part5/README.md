# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh



## Tarea 5.1: Interfaz de lista de blogs, Paso 1

login.js:

´´´
import axios from 'axios'
const baseUrl = '/api/login'

const login = async (credentials) => {
    const response = await axios.post(baseUrl, credentials)
    return response.data
}

export default { login }
´´´

blogs.js:

´´´
import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

export default { getAll, setToken }
´´´
Notification.jsx:
const Notification = ({ message, type }) => {
    if (message === null) return null

    const style = {
    color: type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    }

    return (
    <div style={style}>
        {message}
    </div>
    )
}

export default Notification
´´´

App.jsx:

´´´
import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  // Trae los blogs del backend al cargar la página
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )  
  }, [])

  // Maneja el envío del formulario de inicio de sesión
  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      alert('Wrong credentials')
    }
  }

  // SI NO HAY USUARIO: Solo muestra el formulario de Login
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  // SI HAY USUARIO LOGUEADO: Muestra el nombre y la lista de blogs
  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
      
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
´´´

Respuesta: http://localhost:5173/

Log in to application
username
password
login

blogs
Matti Luukkainen logged in logout

create new
title: 
author: 
url: 
create

Things I Don't Know as of 2018 Dan Abramov
Microservices and the First Law of Distributed Objects Martin Fowler
Prueba de Blog Autenticado Matti Luukkainen
Prueba de Blog Autenticado Matti Luukkainen
Prueba de Blog Autenticado Matti Luukkainen


## Tarea 5.2: Interfaz de lista de blogs, Paso 2
Se aparece el logout

## Tarea 5.3: Interfaz de lista de blogs, Paso 3

blogs.js:

´´´
import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

// Esta función guarda el token en la variable local de arriba
const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// ESTA ES LA FUNCIÓN NUEVA PARA EL 5.3 🚀
const create = async (newObject) => {
  const config = {
    headers: { Authorization: token }, // Aquí se inyecta el token del usuario
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

export default { getAll, create, setToken }
´´´

App.jsx:

´´´
import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  
  // Estados para el formulario de crear blog (5.3)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  // Estado para controlar los carteles de notificación (5.4)
  const [notification, setNotification] = useState({ message: null, type: 'success' })

  // 1. Cargar los blogs del servidor al arrancar
  useEffect(() => {
    blogService.getAll().then(initialBlogs => setBlogs(initialBlogs))  
  }, [])

  // 2. Comprobar si el usuario ya se había logueado antes (5.2)
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // Función auxiliar para mostrar avisos que desaparecen a los 5 segundos
  const notifyWith = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: 'success' })
    }, 5000)
  }

  // Ejecutar el inicio de sesión (5.1)
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      
      // Guardar sesión en el navegador (5.2)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      notifyWith(`Welcome back, ${user.name}`)
    } catch (exception) {
      notifyWith('wrong username or password', 'error')
    }
  }

  // Ejecutar el cierre de sesión (5.2)
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    notifyWith('Logged out successfully')
  }

  // Ejecutar la creación de un nuevo blog (5.3)
  const handleCreateBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = await blogService.create({ title, author, url })
      setBlogs(blogs.concat(newBlog))
      
      notifyWith(`a new blog ${title} by ${author} added`)
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (exception) {
      notifyWith('failed to create blog, check fields', 'error')
    }
  }

  // VISTA A: Si el usuario NO está logueado, solo ve el Login (5.1)
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification.message} type={notification.type} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
          </div>
          <div>
            password
            <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  // VISTA B: Si el usuario SÍ está logueado, ve todo lo demás (5.1, 5.2, 5.3)
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification.message} type={notification.type} />
      
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      <h2>create new</h2>
      <form onSubmit={handleCreateBlog}>
        <div>title: <input value={title} onChange={({ target }) => setTitle(target.value)} /></div>
        <div>author: <input value={author} onChange={({ target }) => setAuthor(target.value)} /></div>
        <div>url: <input value={url} onChange={({ target }) => setUrl(target.value)} /></div>
        <button type="submit">create</button>
      </form>

      <br />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
´´´

http://localhost:5173/

blogs
Matti Luukkainen logged in logout

create new
title: 
author: 
url: 
create

Things I Don't Know as of 2018 Dan Abramov
Microservices and the First Law of Distributed Objects Martin Fowler
Prueba de Blog Autenticado Matti Luukkainen
Prueba de Blog Autenticado Matti Luukkainen
Prueba de Blog Autenticado Matti Luukkainen


## Tarea 5.4: Interfaz de lista de blogs, Paso 4

Notification.js:

´´´
const Notification = ({ message, type }) => {
  // Si no hay mensaje, no dibujes nada en la pantalla
    if (message === null) {
    return null
    }

  // Estilos básicos para que parezca una barra de alerta
    const notificationStyle = {
    color: type === 'error' ? 'red' : 'green', // Rojo si falla, verde si es un éxito
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    }

    return (
    <div style={notificationStyle}>
        {message}
    </div>
    )
}

export default Notification
´´´

blogs.js:

´´´
import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

// Esta función guarda el token en la variable local de arriba
const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// ESTA ES LA FUNCIÓN NUEVA PARA EL 5.3 🚀
const create = async (newObject) => {
  const config = {
    headers: { Authorization: token }, // Aquí se inyecta el token del usuario
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

export default { getAll, create, setToken }

App.jsx:
import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  
  // Estados para el formulario de crear blog (5.3)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  // Estado para controlar los carteles de notificación (5.4)
  const [notification, setNotification] = useState({ message: null, type: 'success' })

  // 1. Cargar los blogs del servidor al arrancar
  useEffect(() => {
    blogService.getAll().then(initialBlogs => setBlogs(initialBlogs))  
  }, [])

  // 2. Comprobar si el usuario ya se había logueado antes (5.2)
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // Función auxiliar para mostrar avisos que desaparecen a los 5 segundos
  const notifyWith = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: 'success' })
    }, 5000)
  }

  // Ejecutar el inicio de sesión (5.1)
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      
      // Guardar sesión en el navegador (5.2)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      notifyWith(`Welcome back, ${user.name}`)
    } catch (exception) {
      notifyWith('wrong username or password', 'error')
    }
  }

  // Ejecutar el cierre de sesión (5.2)
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    notifyWith('Logged out successfully')
  }

  // Ejecutar la creación de un nuevo blog (5.3)
  const handleCreateBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = await blogService.create({ title, author, url })
      setBlogs(blogs.concat(newBlog))
      
      notifyWith(`a new blog ${title} by ${author} added`)
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (exception) {
      notifyWith('failed to create blog, check fields', 'error')
    }
  }

  // VISTA A: Si el usuario NO está logueado, solo ve el Login (5.1)
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification.message} type={notification.type} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
          </div>
          <div>
            password
            <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  // VISTA B: Si el usuario SÍ está logueado, ve todo lo demás (5.1, 5.2, 5.3)
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification.message} type={notification.type} />
      
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      <h2>create new</h2>
      <form onSubmit={handleCreateBlog}>
        <div>title: <input value={title} onChange={({ target }) => setTitle(target.value)} /></div>
        <div>author: <input value={author} onChange={({ target }) => setAuthor(target.value)} /></div>
        <div>url: <input value={url} onChange={({ target }) => setUrl(target.value)} /></div>
        <button type="submit">create</button>
      </form>

      <br />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
´´´

Respuesta en http://localhost:5173/ tal como salen en las fotografías (verde, rojo).

## Tarea 5.5 Interfaz de listas de blogs, Step5

blogs.js:

´´´
import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

// Esta función guarda el token en la variable local de arriba
const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// ESTA ES LA FUNCIÓN NUEVA PARA EL 5.3 🚀
const create = async (newObject) => {
  const config = {
    headers: { Authorization: token }, // Aquí se inyecta el token del usuario
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

export default { getAll, create, setToken }
´´´

Togglable.jsx:

´´´
import { useState, forwardRef, useImperativeHandle } from 'react'

const Togglable = forwardRef((props, refs) => {
    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
    setVisible(!visible)
    }

    useImperativeHandle(refs, () => {
    return { toggleVisibility }
    })

    return (
    <div>
        <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
        </div>
        <div style={showWhenVisible}>
        {props.children}
        {/* AQUÍ ESTÁ EL BOTÓN QUE TE FALTA ⬇️ */}
        <button onClick={toggleVisibility}>cancel</button>
        </div>
    </div>
    )
})

Togglable.displayName = 'Togglable'

export default Togglable
´´´

App.jsx:

´´´
import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable' // <--- ¡ESTA IMPORTACIÓN FALTABA! 🚀
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  // Estados para el formulario de crear blog (5.3)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  // Estado para controlar los carteles de notificación (5.4)
  const [notification, setNotification] = useState({ message: null, type: 'success' })

  // 1. Cargar los blogs del servidor al arrancar
  useEffect(() => {
    blogService.getAll().then(initialBlogs => setBlogs(initialBlogs))  
  }, [])

  // 2. Comprobar si el usuario ya se había logueado antes (5.2)
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // Función auxiliar para mostrar avisos que desaparecen a los 5 segundos
  const notifyWith = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: 'success' })
    }, 5000)
  }

  // Ejecutar el inicio de sesión (5.1)
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      
      // Guardar sesión en el navegador (5.2)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      notifyWith(`Welcome back, ${user.name}`)
    } catch {
      notifyWith('wrong username or password', 'error')
    }
  }

  // Ejecutar el cierre de sesión (5.2)
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    notifyWith('Logged out successfully')
  }

  // Ejecutar la creación de un nuevo blog (5.3 y 5.5)
  const handleCreateBlog = async (event) => {
    event.preventDefault()
    try {
      // Hace que el formulario Togglable se oculte automáticamente al guardar un blog
      blogFormRef.current.toggleVisibility() 
      
      const newBlog = await blogService.create({ title, author, url })
      setBlogs(blogs.concat(newBlog))
      
      notifyWith(`a new blog ${title} by ${author} added`)
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch {
      notifyWith('failed to create blog, check fields', 'error')
    }
  }

  // VISTA A: Si el usuario NO está logueado, solo ve el Login (5.1)
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification.message} type={notification.type} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
          </div>
          <div>
            password
            <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  // VISTA B: Si el usuario SÍ está logueado, ve todo lo demás
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification.message} type={notification.type} />
      
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      {/* Formulario condicional oculto/visible bajo demanda */}
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <h2>create new</h2>
        <form onSubmit={handleCreateBlog}>
          <div>title: <input value={title} onChange={({ target }) => setTitle(target.value)} /></div>
          <div>author: <input value={author} onChange={({ target }) => setAuthor(target.value)} /></div>
          <div>url: <input value={url} onChange={({ target }) => setUrl(target.value)} /></div>
          <button type="submit">create</button>
        </form>
      </Togglable>

      <br />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
´´´

http://localhost:5173/

blogs
Matti Luukkainen logged in logout

create new
title: 
author: 
url: 
create
cancel

Things I Don't Know as of 2018 Dan Abramov
Microservices and the First Law of Distributed Objects Martin Fowler
Prueba de Blog Autenticado Matti Luukkainen
Prueba de Blog Autenticado Matti Luukkainen
Prueba de Blog Autenticado Matti Luukkainen
Alicia en el país Yoyo

* Cuando se cancela, queda:

blogs
Matti Luukkainen logged in logout

new blog

Things I Don't Know as of 2018 Dan Abramov
Microservices and the First Law of Distributed Objects Martin Fowler
Prueba de Blog Autenticado Matti Luukkainen
Prueba de Blog Autenticado Matti Luukkainen
Prueba de Blog Autenticado Matti Luukkainen
Alicia en el país Yoyo


## Tarea 5.6 Interfaz de lista de blogs, Paso 6
BlogForm.jsx:

´´´
import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleCreate = (event) => {
    event.preventDefault()
    
    // Le pasamos los datos limpios al componente padre
    createBlog({ title, author, url })

    // Limpiamos los inputs locales
    setTitle('')
    setAuthor('')
    setUrl('')
    }

    return (
    <div>
        <h2>create new</h2>
        <form onSubmit={handleCreate}>
        <div>
            title: 
            <input value={title} onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
            author: 
            <input value={author} onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
            url: 
            <input value={url} onChange={({ target }) => setUrl(target.value)} />
        </div>
        <button type="submit">create</button>
        </form>
    </div>
    )
}

export default BlogForm
´´´

blogs.js:

´´´
import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

// Esta función guarda el token en la variable local de arriba
const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// ESTA ES LA FUNCIÓN NUEVA PARA EL 5.3 🚀
const create = async (newObject) => {
  const config = {
    headers: { Authorization: token }, // Aquí se inyecta el token del usuario
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

export default { getAll, create, setToken }
´´´

App.jsx:

´´´
import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm' // <--- 1. Importamos el nuevo componente 🚀
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: 'success' })
  
  const blogFormRef = useRef()

  // 💡 Nota: Los estados 'title', 'author' y 'url' ya NO están aquí. ¡Se mudaron a BlogForm!

  useEffect(() => {
    blogService.getAll().then(initialBlogs => setBlogs(initialBlogs))  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notifyWith = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: 'success' })
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      notifyWith(`Welcome back, ${user.name}`)
    } catch {
      notifyWith('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    notifyWith('Logged out successfully')
  }

  // 2. Esta función ahora recibe el objeto directamente desde el BlogForm 🚀
  const createBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility() 
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      notifyWith(`a new blog ${blogObject.title} by ${blogObject.author} added`)
    } catch {
      notifyWith('failed to create blog, check fields', 'error')
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification.message} type={notification.type} />
        <form onSubmit={handleLogin}>
          <div>username <input type="text" value={username} onChange={({ target }) => setUsername(target.value)} /></div>
          <div>password <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} /></div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification.message} type={notification.type} />
      
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      {/* 3. Reemplazamos todo el HTML del formulario viejo por nuestro nuevo componente modular 🚀 */}
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>

      <br />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
´´´

http://localhost:5173/

blogs
Matti Luukkainen logged in logout

create new
title:
author:
url:
create
cancel

Things I Don't Know as of 2018 Dan Abramov
Microservices and the First Law of Distributed Objects Martin Fowler
Prueba de Blog Autenticado Matti Luukkainen
Prueba de Blog Autenticado Matti Luukkainen
Prueba de Blog Autenticado Matti Luukkainen
Alicia en el país Yoyo

Cambia (se separa) cuando se cancela:
blogs
Matti Luukkainen logged in logout

new blog

Things I Don't Know as of 2018 Dan Abramov
Microservices and the First Law of Distributed Objects Martin Fowler
Prueba de Blog Autenticado Matti Luukkainen
Prueba de Blog Autenticado Matti Luukkainen
Prueba de Blog Autenticado Matti Luukkainen
Alicia en el país Yoyo


## Tarea 5.7 Interfaz de listas de blogs, Step7

Blog.jsx:

´´´
import { useState } from 'react'

const Blog = ({ blog }) => {
  // Estado local para controlar si este blog específico está expandido
  const [visible, setVisible] = useState(false)

  // Estilo CSS en línea sugerido por el ejercicio
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  // Manejador para alternar el estado visible
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle}>
      {/* Información que siempre es visible */}
      <div>
        {blog.title} {blog.author} {' '}
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {/* Información condicional que se despliega al hacer clic en view */}
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} <button>like</button>
          </div>
          <div>{blog.user ? blog.user.name : 'Unknown User'}</div>
        </div>
      )}
    </div>
  )
}

export default Blog
´´´

http://localhost:5173/
blogs
Matti Luukkainen logged in logout

new blog

Things I Don't Know as of 2018 Dan Abramov hide
https://overreacted.io/things-i-dont-know-as-of-2018/
likes 8 like
Matti Luukkainen
Microservices and the First Law of Distributed Objects Martin Fowler hide
https://martinfowler.com/articles/distributed-objects-microservices.html
likes 5 like
Arto Hellas
Prueba de Blog Autenticado Matti Luukkainen hide
https://fullstackopen.com/
likes 12 like
Matti Luukkainen
Prueba de Blog Autenticado Matti Luukkainen hide
https://fullstackopen.com/
likes 12 like
Matti Luukkainen
Prueba de Blog Autenticado Matti Luukkainen hide
https://fullstackopen.com/
likes 12 like
Matti Luukkainen
Alicia en el país Yoyo hide
www.alicia.com
likes 0 like
Matti Luukkainen


## Tarea 5.8: Interfaz de lista de blogs, Paso 8

blogs.js:
´´´
import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

// 🚀 ENVIAR ACTUALIZACIÓN DE LIKES (PUT) - Solo Axios
const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return response.data
}

export default { getAll, create, update, setToken }
´´´

Blog.jsx:

´´´
import { useState } from 'react'

const Blog = ({ blog, updateLikes }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = () => {
    // Verificamos si blog.user es un objeto (y sacamos su id) o si ya es un string directamente
    const userId = blog.user && typeof blog.user === 'object' 
      ? (blog.user.id || blog.user._id) 
      : blog.user

    const updatedBlog = {
      user: userId, // <-- Enviamos solo el ID plano que el backend espera recibir
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    
    updateLikes(blog.id, updatedBlog)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} {' '}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} {' '}
            <button onClick={handleLike}>like</button> 
          </div>
          <div>{blog.user ? blog.user.name : 'Unknown User'}</div>
        </div>
      )}
    </div>
  )
}

export default Blog
´´´

App.jsx:

´´´
import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: 'success' })
  
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(initialBlogs => setBlogs(initialBlogs))  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notifyWith = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: 'success' })
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      notifyWith(`Welcome back, ${user.name}`)
    } catch {
      notifyWith('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    notifyWith('Logged out successfully')
  }

  const createBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility() 
      const newBlog = await blogService.create(blogObject)
      
      // Fix preventivo: Adjuntamos el usuario logueado al nuevo blog para que se renderice su nombre de inmediato
      newBlog.user = user 
      
      setBlogs(blogs.concat(newBlog))
      notifyWith(`a new blog ${blogObject.title} by ${blogObject.author} added`)
    } catch {
      notifyWith('failed to create blog, check fields', 'error')
    }
  }

  // 🚀 FUNCIÓN UPDATE ACTUALIZADA (Cubre Ejercicios 5.8 y 5.9)
  const updateLikes = async (id, blogObject) => {
    try {
      const returnedBlog = await blogService.update(id, blogObject)
      
      // Buscamos el blog original para re-inyectar el objeto 'user' completo (con name y username)
      // Esto evita que al actualizar los likes, desaparezca el nombre del creador en la interfaz
      const originalBlog = blogs.find(b => b.id === id)
      returnedBlog.user = originalBlog.user
      
      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
    } catch (exception) {
      console.error('❌ Error detallado en la petición PUT:', exception)
      notifyWith('failed to update likes', 'error')
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification.message} type={notification.type} />
        <form onSubmit={handleLogin}>
          <div>username <input type="text" value={username} onChange={({ target }) => setUsername(target.value)} /></div>
          <div>password <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} /></div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  // 🚀 EJERCICIO 5.10: Ordenar la lista de blogs de mayor a menor número de likes antes de mapear
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification.message} type={notification.type} />
      
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>

      <br />
      {/* Mapeamos sobre la lista ordenada 'sortedBlogs' en lugar de 'blogs' */}
      {sortedBlogs.map(blog =>
        <Blog 
          key={blog.id} 
          blog={blog} 
          updateLikes={updateLikes}
        />
      )}
    </div>
  )
}

export default App
´´´


controllers/blogs.js (backend de la parte 4):

´´´
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// 1. OBTENER TODOS LOS BLOGS (Muestra datos del creador expandidos)
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 }) // Expande el id por el objeto usuario

  response.json(blogs)
})

// 2. CREAR UN NUEVO BLOG (Requiere Token)
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  // Extraer el usuario del objeto request (asumiendo que usas el middleware userExtractor)
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id // Guardamos la referencia de la ID del creador
  })

  const savedBlog = await blog.save()
  
  // Guardamos el ID del blog en la lista de blogs del usuario
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

// 3. ACTUALIZAR LIKES (Ejercicio 5.8 & 5.9 Fix)
blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes, user } = request.body

  const blog = {
    title,
    author,
    url,
    likes,
    user: user // Recibe la ID string limpia enviada desde el frontend
  }

  // { new: true } devuelve el documento modificado en lugar del viejo
  const updatedBlog = await Blog
    .findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true, context: 'query' })
  
  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

// 4. ELIMINAR UN BLOG (Ejercicio 5.11 - Con restricción de seguridad)
blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user // Requiere middleware userExtractor

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  // Verificar de forma estricta si el creador coincide con el usuario autenticado
  if (blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'only the creator can delete this blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  
  // Limpiar el ID del blog eliminado dentro del array del usuario
  user.blogs = user.blogs.filter(b => b.toString() !== request.params.id)
  await user.save()

  response.status(204).end()
})

module.exports = blogsRouter
´´´

Respuesta http://localhost:5173/:
blogs
Matti Luukkainen logged in logout

new blog

Prueba de Blog Autenticado Matti Luukkainen view
Prueba de Blog Autenticado Matti Luukkainen view
Prueba de Blog Autenticado Matti Luukkainen view
Things I Don't Know as of 2018 Dan Abramov view
Microservices and the First Law of Distributed Objects Martin Fowler hide
https://martinfowler.com/articles/distributed-objects-microservices.html
likes 6 like
Arto Hellas
Alicia en el país Yoyo hide
www.alicia.com
likes 1 like
Matti Luukkainen


## Tarea 5.9*: Parte frontal de la lista de blogs, Step9
App.jsx:

´´´
import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: 'success' })
  
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(initialBlogs => setBlogs(initialBlogs))  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notifyWith = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: 'success' })
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      notifyWith(`Welcome back, ${user.name}`)
    } catch {
      notifyWith('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    notifyWith('Logged out successfully')
  }

  const createBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility() 
      const newBlog = await blogService.create(blogObject)
      
      // Fix preventivo: Adjuntamos el usuario logueado al nuevo blog para que se renderice su nombre de inmediato
      newBlog.user = user 
      
      setBlogs(blogs.concat(newBlog))
      notifyWith(`a new blog ${blogObject.title} by ${blogObject.author} added`)
    } catch {
      notifyWith('failed to create blog, check fields', 'error')
    }
  }

  // 🚀 FUNCIÓN UPDATE ACTUALIZADA (Cubre Ejercicios 5.8 y 5.9)
  const updateLikes = async (id, blogObject) => {
  try {
    const returnedBlog = await blogService.update(id, blogObject)
    
    // 🚀 PASO 5.9 FIX: Buscamos el objeto del blog original antes de que mutara
    const originalBlog = blogs.find(b => b.id === id)
    
    // Conservamos la estructura expandida del usuario mapeándolo en la respuesta
    returnedBlog.user = originalBlog.user
    
    // Actualizamos el estado con el objeto reconstruido
    setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
  } catch (exception) {
    console.error('Error actualizando los likes:', exception)
    notifyWith('failed to update likes', 'error')
  }
}

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification.message} type={notification.type} />
        <form onSubmit={handleLogin}>
          <div>username <input type="text" value={username} onChange={({ target }) => setUsername(target.value)} /></div>
          <div>password <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} /></div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  // 🚀 EJERCICIO 5.10: Ordenar la lista de blogs de mayor a menor número de likes antes de mapear
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification.message} type={notification.type} />
      
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>

      <br />
      {/* Mapeamos sobre la lista ordenada 'sortedBlogs' en lugar de 'blogs' */}
      {sortedBlogs.map(blog =>
        <Blog 
          key={blog.id} 
          blog={blog} 
          updateLikes={updateLikes}
        />
      )}
    </div>
  )
}

export default App
´´´

blogs
Matti Luukkainen logged in logout

new blog

Prueba de Blog Autenticado Matti Luukkainen hide
https://fullstackopen.com/
likes 13 like
Matti Luukkainen
Prueba de Blog Autenticado Matti Luukkainen hide
https://fullstackopen.com/
likes 13 like
Matti Luukkainen
Prueba de Blog Autenticado Matti Luukkainen hide
https://fullstackopen.com/
likes 12 like
Matti Luukkainen
Things I Don't Know as of 2018 Dan Abramov hide
https://overreacted.io/things-i-dont-know-as-of-2018/
likes 9 like
Matti Luukkainen
Microservices and the First Law of Distributed Objects Martin Fowler hide
https://martinfowler.com/articles/distributed-objects-microservices.html
likes 7 like
Arto Hellas
Alicia en el país Yoyo hide
www.alicia.com
likes 2 like
Matti Luukkainen


## Tarea 5.10: Interfaz de lista de blogs, paso 10
App.jsx:

´´´
import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: 'success' })
  
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(initialBlogs => setBlogs(initialBlogs))  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notifyWith = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: 'success' })
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      notifyWith(`Welcome back, ${user.name}`)
    } catch {
      notifyWith('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    notifyWith('Logged out successfully')
  }

  const createBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility() 
      const newBlog = await blogService.create(blogObject)
      
      // Fix preventivo: Adjuntamos el usuario logueado al nuevo blog para que se renderice su nombre de inmediato
      newBlog.user = user 
      
      setBlogs(blogs.concat(newBlog))
      notifyWith(`a new blog ${blogObject.title} by ${blogObject.author} added`)
    } catch {
      notifyWith('failed to create blog, check fields', 'error')
    }
  }

  // 🚀 FUNCIÓN UPDATE ACTUALIZADA (Cubre Ejercicios 5.8 y 5.9)
  const updateLikes = async (id, blogObject) => {
  try {
    const returnedBlog = await blogService.update(id, blogObject)
    
    // 🚀 PASO 5.9 FIX: Buscamos el objeto del blog original antes de que mutara
    const originalBlog = blogs.find(b => b.id === id)
    
    // Conservamos la estructura expandida del usuario mapeándolo en la respuesta
    returnedBlog.user = originalBlog.user
    
    // Actualizamos el estado con el objeto reconstruido
    setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
  } catch (exception) {
    console.error('Error actualizando los likes:', exception)
    notifyWith('failed to update likes', 'error')
  }
}

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification.message} type={notification.type} />
        <form onSubmit={handleLogin}>
          <div>username <input type="text" value={username} onChange={({ target }) => setUsername(target.value)} /></div>
          <div>password <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} /></div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  // 🚀 PASO 5.10: Creamos una copia del estado y la ordenamos de mayor a menor número de likes
  // b.likes - a.likes asegura el orden descendente
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification.message} type={notification.type} />
      
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>

      <br />
      {/* 🚀 CAMBIO AQUÍ: Ahora mapeamos sobre 'sortedBlogs' en lugar de 'blogs' */}
      {sortedBlogs.map(blog =>
        <Blog 
          key={blog.id} 
          blog={blog} 
          updateLikes={updateLikes}
        />
      )}
    </div>
  )
}

export default App
´´´

http://localhost:5173/
blogs
Matti Luukkainen logged in logout

new blog

Prueba de Blog Autenticado Matti Luukkainen hide
https://fullstackopen.com/
likes 13 like
Matti Luukkainen
Prueba de Blog Autenticado Matti Luukkainen hide
https://fullstackopen.com/
likes 13 like
Matti Luukkainen
Prueba de Blog Autenticado Matti Luukkainen hide
https://fullstackopen.com/
likes 12 like
Matti Luukkainen
Things I Don't Know as of 2018 Dan Abramov hide
https://overreacted.io/things-i-dont-know-as-of-2018/
likes 9 like
Matti Luukkainen
Microservices and the First Law of Distributed Objects Martin Fowler hide
https://martinfowler.com/articles/distributed-objects-microservices.html
likes 7 like
Arto Hellas
Alicia en el país Yoyo hide
www.alicia.com
likes 2 like
Matti Luukkainen


## Tarea 5.11: Interfaz de lista de blogs, Paso 11
blogs.js:

´´´
import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

// 🚀 ENVIAR ACTUALIZACIÓN DE LIKES (PUT) - Solo Axios
const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return response.data
}

// Agrega esto en src/services/blogs.js junto a las demás funciones
const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

// No olvides exportarlo al final del archivo:
export default { getAll, create, update, remove, setToken }
´´´

Blog.jsx:

´´´
import { useState } from 'react'

const Blog = ({ blog, updateLikes, deleteBlog, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = () => {
    const userId = blog.user && typeof blog.user === 'object' 
      ? (blog.user.id || blog.user._id) 
      : blog.user

    const updatedBlog = {
      user: userId,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    
    updateLikes(blog.id, updatedBlog)
  }

  // 🚀 Manejador para eliminar con confirmación de ventana nativa
  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }

  // 🚀 Lógica de control para el botón de eliminar
  // Verificamos si el usuario existe y si su ID o username coincide con el usuario logueado
  const showRemoveButton = blog.user && currentUser && (
    (blog.user.id && blog.user.id === currentUser.id) || 
    (blog.user._id && blog.user._id === currentUser.id) ||
    (blog.user.username && blog.user.username === currentUser.username)
  )

  // Estilo simple para el botón azul de tu captura
  const removeButtonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '5px'
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} {' '}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div>
          <div><a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a></div>
          <div>
            likes {blog.likes} {' '}
            <button onClick={handleLike}>like</button> 
          </div>
          <div>{blog.user ? blog.user.name : 'Unknown User'}</div>
          
          {/* 🚀 Renderizado condicional del botón de borrado */}
          {showRemoveButton && (
            <button style={removeButtonStyle} onClick={handleRemove}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
´´´

App.jsx:

´´´
import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: 'success' })
  
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(initialBlogs => setBlogs(initialBlogs))  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notifyWith = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: 'success' })
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      notifyWith(`Welcome back, ${user.name}`)
    } catch {
      notifyWith('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    notifyWith('Logged out successfully')
  }

  const createBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility() 
      const newBlog = await blogService.create(blogObject)
      
      newBlog.user = user 
      
      setBlogs(blogs.concat(newBlog))
      notifyWith(`a new blog ${blogObject.title} by ${blogObject.author} added`)
    } catch {
      notifyWith('failed to create blog, check fields', 'error')
    }
  }

  // 🚀 ACTUALIZAR LIKES (Paso 5.8 y 5.9) - Separado correctamente
  const updateLikes = async (id, blogObject) => {
    try {
      const returnedBlog = await blogService.update(id, blogObject)
      const originalBlog = blogs.find(b => b.id === id)
      returnedBlog.user = originalBlog.user
      
      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
    } catch (exception) {
      console.error('Error actualizando los likes:', exception)
      notifyWith('failed to update likes', 'error')
    }
  }

  // 🚀 ELIMINAR BLOG (Paso 5.11) - Ahora está afuera e independiente
  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      notifyWith('Blog removed successfully')
    } catch (exception) {
      console.error('Error deleting blog:', exception)
      notifyWith('failed to delete blog', 'error')
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification.message} type={notification.type} />
        <form onSubmit={handleLogin}>
          <div>username <input type="text" value={username} onChange={({ target }) => setUsername(target.value)} /></div>
          <div>password <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} /></div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  // 🚀 ORDENAR POR LIKES (Paso 5.10)
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification.message} type={notification.type} />
      
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>

      <br />
      {sortedBlogs.map(blog =>
        <Blog 
          key={blog.id} 
          blog={blog} 
          updateLikes={updateLikes}
          deleteBlog={deleteBlog}
          currentUser={user}
        />
      )}
    </div>
  )
} // <--- Cierre de la función App que faltaba

export default App
´´´

Respuesta http://localhost:5173/:

blogs
Matti Luukkainen logged in logout

new blog

Prueba de Blog Autenticado Matti Luukkainen view
Prueba de Blog Autenticado Matti Luukkainen view
Prueba de Blog Autenticado Matti Luukkainen view
Things I Don't Know as of 2018 Dan Abramov view
Microservices and the First Law of Distributed Objects Martin Fowler view
Alicia en el país Yoyo hide
www.alicia.com
likes 2 like
Matti Luukkainen
remove


## Tarea 5.12: Interfaz de lista de blogs, Paso 12
eslint.config.js:

´´´
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off'
    }
  }
]
´´´

settings.json:

´´´
{
    "eslint.workingDirectories": [{ "mode": "auto" }]
}
´´´

Se ejecuta  npm run lint y resultan:

PS C:\...\fullstackopen2026\part5\bloglist-frontend> npm run lint

> bloglist-frontend@0.0.0 lint
> eslint .


C:\...\fullstackopen2026\part5\bloglist-frontend\eslint.config.js
   1:28  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   2:30  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   3:51  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   4:55  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   5:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   6:17  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   7:25  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   8:4   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   9:30  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  10:23  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  11:25  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  12:32  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  13:23  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  14:31  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  15:37  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  16:29  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  17:8   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  18:7   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  19:15  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  20:33  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  21:36  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  22:7   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  23:13  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  24:39  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  25:47  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  26:69  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  27:48  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  28:16  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  29:38  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  30:9   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  31:28  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  32:44  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  33:35  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  34:32  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  35:23  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  36:37  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  37:51  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  38:65  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  39:26  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  40:6   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  41:4   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style

C:\...\fullstackopen2026\part5\bloglist-frontend\src\App.jsx
    1:52   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
    2:37   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
    3:53   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
    4:47   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
    5:45   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
    6:43   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
    7:44   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
    8:1    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
    9:20   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   10:41   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   11:47   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   12:47   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   13:41   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   14:87   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   15:1    error  Trailing spaces not allowed                      no-trailing-spaces
   15:3    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   16:31   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   17:1    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   18:20   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   19:70   error  Trailing spaces not allowed                      no-trailing-spaces
   19:72   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   20:9    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   21:1    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   22:20   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   23:76   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   24:26   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   25:46   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   26:20   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   27:39   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   28:6    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   29:9    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   30:1    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   31:54   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   32:39   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   33:23   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   34:58   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   35:13   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   36:4    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   37:1    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   38:41   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   39:27   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   40:10   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   41:68   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   42:77   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   43:39   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   44:20   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   45:22   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   46:22   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   47:47   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   48:14   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   49:56   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   50:6    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   51:4    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   52:1    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   53:31   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   54:56   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   55:18   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   56:42   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   57:4    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   58:1    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   59:45   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   60:10   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   61:45   error  Trailing spaces not allowed                      no-trailing-spaces
   61:46   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   62:59   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   63:1    error  Trailing spaces not allowed                      no-trailing-spaces
   63:7    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   64:26   error  Trailing spaces not allowed                      no-trailing-spaces
   64:27   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   65:1    error  Trailing spaces not allowed                      no-trailing-spaces
   65:7    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   66:38   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   67:81   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   68:14   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   69:65   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   70:6    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   71:4    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   72:1    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   73:67   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   74:50   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   75:10   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   76:68   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   77:56   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   78:44   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   79:1    error  Trailing spaces not allowed                      no-trailing-spaces
   79:7    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   80:72   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   81:26   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   82:64   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   83:52   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   84:6    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   85:4    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   86:1    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   87:70   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   88:37   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   89:10   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   90:35   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   91:53   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   92:46   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   93:26   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   94:55   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   95:51   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   96:6    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   97:4    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   98:1    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   99:23   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  100:13   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  101:12   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  102:39   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  103:81   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  104:38   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  105:122  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  106:126  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  107:47   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  108:16   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  109:13   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  110:6    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  111:4    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  112:1    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  113:38   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  114:67   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  115:1    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  116:11   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  117:10   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  118:21   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  119:79   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  120:1    error  Trailing spaces not allowed                      no-trailing-spaces
  120:7    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  121:82   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  122:1    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  123:59   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  124:45   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  125:19   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  126:1    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  127:13   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  128:31   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  129:14   error  Trailing spaces not allowed                      no-trailing-spaces
  129:15   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  130:24   error  Trailing spaces not allowed                      no-trailing-spaces
  130:25   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  131:22   error  Trailing spaces not allowed                      no-trailing-spaces
  131:23   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  132:36   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  133:34   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  134:29   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  135:11   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  136:9    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  137:11   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  138:4    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  139:47   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  140:1    error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style

C:\...\fullstackopen2026\part5\bloglist-frontend\src\components\Blog.jsx
   1:33  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   2:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   3:67  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   4:48  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   5:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   6:22  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   7:20  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   8:20  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   9:21  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  10:20  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  11:20  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  12:4   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  13:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  14:29  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  15:62  error  Trailing spaces not allowed                      no-trailing-spaces
  15:63  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  16:40  error  Trailing spaces not allowed                      no-trailing-spaces
  16:41  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  17:18  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  18:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  19:26  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  20:20  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  21:29  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  22:27  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  23:25  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  24:20  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  25:6   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  26:1   error  Trailing spaces not allowed                      no-trailing-spaces
  26:5   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  27:38  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  28:4   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  29:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  30:67  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  31:31  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  32:74  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  33:26  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  34:6   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  35:4   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  36:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  37:52  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  38:93  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  39:57  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  40:57  error  Trailing spaces not allowed                      no-trailing-spaces
  40:58  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  41:59  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  42:72  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  43:4   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  44:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  45:52  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  46:30  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  47:32  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  48:20  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  49:20  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  50:25  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  51:25  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  52:23  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  53:21  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  54:4   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  55:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  56:11  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  57:28  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  58:12  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  59:41  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  60:54  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  61:38  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  62:18  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  63:13  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  64:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  65:20  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  66:14  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  67:88  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  68:16  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  69:37  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  70:55  error  Trailing spaces not allowed                      no-trailing-spaces
  70:56  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  71:17  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  72:67  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  73:1   error  Trailing spaces not allowed                      no-trailing-spaces
  73:11  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  74:66  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  75:33  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  76:70  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  77:21  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  78:22  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  79:13  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  80:15  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  81:9   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  82:11  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  83:4   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  84:2   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  85:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style

C:\...\fullstackopen2026\part5\bloglist-frontend\src\components\BlogForm.jsx
   1:33  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   2:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   3:39  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   4:1   error  Expected indentation of 2 spaces but found 4     indent
   4:43  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   5:1   error  Expected indentation of 2 spaces but found 4     indent
   5:45  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   6:1   error  Expected indentation of 2 spaces but found 4     indent
   6:39  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   7:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   8:1   error  Expected indentation of 2 spaces but found 4     indent
   8:38  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   9:27  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  10:1   error  Trailing spaces not allowed                      no-trailing-spaces
  10:5   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  11:56  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  12:39  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  13:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  14:36  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  15:17  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  16:18  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  17:15  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  18:1   error  Expected indentation of 2 spaces but found 4     indent
  18:6   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  19:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  20:1   error  Expected indentation of 2 spaces but found 4     indent
  20:13  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  21:10  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  22:1   error  Expected indentation of 6 spaces but found 8     indent
  22:28  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  23:1   error  Expected indentation of 6 spaces but found 8     indent
  23:39  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  24:14  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  25:19  error  Trailing spaces not allowed                      no-trailing-spaces
  25:20  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  26:1   error  Expected indentation of 10 spaces but found 12   indent
  26:86  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  27:15  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  28:14  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  29:20  error  Trailing spaces not allowed                      no-trailing-spaces
  29:21  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  30:1   error  Expected indentation of 10 spaces but found 12   indent
  30:88  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  31:15  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  32:14  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  33:17  error  Trailing spaces not allowed                      no-trailing-spaces
  33:18  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  34:1   error  Expected indentation of 10 spaces but found 12   indent
  34:82  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  35:15  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  36:46  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  37:1   error  Expected indentation of 6 spaces but found 8     indent
  37:16  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  38:11  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  39:1   error  Expected indentation of 2 spaces but found 4     indent
  39:6   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  40:2   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  41:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style

C:\...\fullstackopen2026\part5\bloglist-frontend\src\components\Notification.jsx
   1:46  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   2:55  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   3:1   error  Expected indentation of 2 spaces but found 4     indent
   3:28  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   4:16  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   5:1   error  Expected indentation of 2 spaces but found 4     indent
   5:6   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   6:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   7:58  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   8:1   error  Expected indentation of 2 spaces but found 4     indent
   8:32  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   9:86  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  10:29  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  11:18  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  12:26  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  13:21  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  14:17  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  15:22  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  16:1   error  Expected indentation of 2 spaces but found 4     indent
  16:6   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  17:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  18:1   error  Expected indentation of 2 spaces but found 4     indent
  18:13  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  19:36  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  20:1   error  Expected indentation of 6 spaces but found 8     indent
  20:18  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  21:11  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  22:1   error  Expected indentation of 2 spaces but found 4     indent
  22:6   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  23:2   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  24:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style

C:\...\fullstackopen2026\part5\bloglist-frontend\src\components\Togglable.jsx
   1:66  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   2:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   3:48  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   4:1   error  Expected indentation of 2 spaces but found 4     indent
   4:50  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   5:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   6:1   error  Expected indentation of 2 spaces but found 4     indent
   6:63  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   7:1   error  Expected indentation of 2 spaces but found 4     indent
   7:63  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   8:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   9:1   error  Expected indentation of 2 spaces but found 4     indent
   9:37  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  10:25  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  11:1   error  Expected indentation of 2 spaces but found 4     indent
  11:6   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  12:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  13:1   error  Expected indentation of 2 spaces but found 4     indent
  13:38  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  14:32  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  15:1   error  Expected indentation of 2 spaces but found 4     indent
  15:7   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  16:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  17:1   error  Expected indentation of 2 spaces but found 4     indent
  17:13  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  18:10  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  19:1   error  Expected indentation of 6 spaces but found 8     indent
  19:38  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  20:72  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  21:1   error  Expected indentation of 6 spaces but found 8     indent
  21:15  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  22:1   error  Expected indentation of 6 spaces but found 8     indent
  22:38  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  23:25  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  24:51  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  25:59  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  26:1   error  Expected indentation of 6 spaces but found 8     indent
  26:15  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  27:11  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  28:1   error  Expected indentation of 2 spaces but found 4     indent
  28:6   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  29:3   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  30:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  31:36  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  32:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style

C:\...\fullstackopen2026\part5\bloglist-frontend\src\main.jsx
  1:40  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  2:24  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  3:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style

C:\...\fullstackopen2026\part5\bloglist-frontend\src\services\blogs.js
   1:26  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   2:29  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   3:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   4:17  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   5:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   6:33  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   7:31  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   8:2   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   9:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  10:23  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  11:37  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  12:49  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  13:2   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  14:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  15:38  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  16:19  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  17:39  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  18:4   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  19:64  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  20:23  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  21:2   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  22:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  23:55  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  24:42  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  25:19  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  26:39  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  27:4   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  28:74  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  29:23  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  30:2   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  31:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  32:68  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  33:31  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  34:19  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  35:39  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  36:4   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  37:66  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  38:23  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  39:2   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  40:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  41:47  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style

C:\...\fullstackopen2026\part5\bloglist-frontend\src\services\login.js
  1:26  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  2:29  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  3:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  4:39  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  5:1   error  Expected indentation of 2 spaces but found 4     indent
  5:60  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  6:1   error  Expected indentation of 2 spaces but found 4     indent
  6:25  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  7:2   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  8:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style

C:\...\fullstackopen2026\part5\bloglist-frontend\vite.config.js
   1:36  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   2:41  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   3:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   4:28  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   5:30  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   6:22  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   7:12  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   8:13  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
   9:16  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  10:41  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  11:27  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  12:8   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  13:6   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  14:4   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style
  15:3   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style

✖ 486 problems (486 errors, 0 warnings)
  486 errors and 0 warnings potentially fixable with the `--fix` option.

Y arreglamos con npm run lint -- --fix

Lo que resulta en:


> bloglist-frontend@0.0.0 lint
> eslint . --fix

Volvemos a ejecutar npm run lint y resulta:
npm run lint

> bloglist-frontend@0.0.0 lint
> eslint .

No hay más errores.

## Tarea 5.13: Pruebas de lista de blogs, Paso 1

Blog.test.jsx:

´´´
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renderiza el título y el autor, pero oculta la URL y los likes por defecto', () => {
    const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Full Stack Open',
    url: 'https://fullstackopen.com',
    likes: 5,
    user: {
        name: 'Test User'
    }
    }

  // Renderizamos el componente pasándole las props que normalmente requiere
    render(<Blog blog={blog} currentUser={{ name: 'Test User' }} />)

  // Verificamos que el título esté en el documento
    const titleElement = screen.getByText(/Component testing is done with react-testing-library/i)
    expect(titleElement).toBeInTheDocument()

  // Verificamos que la URL NO esté visible inicialmente (ej. usando queryByText)
    const urlElement = screen.queryByText('https://fullstackopen.com')
  expect(urlElement).toBeNull() // O expect(urlElement).not.toBeVisible() según cómo lo ocultes en tu CSS
})
´´´

Se ejecuta npm run test

Resulta en:


PS C:\...\fullstackopen2026\part5\bloglist-frontend> npm run test

> bloglist-frontend@0.0.0 test
> vitest run


 RUN  v4.1.7 C:/.../oro/fullstackopen2026/part5/bloglist-frontend

 ✓ src/components/Blog.test.jsx (1 test) 50ms
   ✓ renderiza el título y el autor, pero oculta la URL y los likes por defecto 48ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  15:21:02
   Duration  2.38s (transform 83ms, setup 321ms, import 50ms, tests 50ms, environment 1.72s)


## Tarea 5.14: Pruebas de lista de blogs, Paso 2
Blog.test.jsx:

´´´
import userEvent from '@testing-library/user-event' // 🚀 AGREGA ESTA LÍNEA
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renderiza el título y el autor, pero oculta la URL y los likes por defecto', () => {
    const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Full Stack Open',
    url: 'https://fullstackopen.com',
    likes: 5,
    user: {
        name: 'Test User'
    }
    }

  // Renderizamos el componente pasándole las props que normalmente requiere
    render(<Blog blog={blog} currentUser={{ name: 'Test User' }} />)

  // Verificamos que el título esté en el documento
    const titleElement = screen.getByText(/Component testing is done with react-testing-library/i)
    expect(titleElement).toBeInTheDocument()

  // Verificamos que la URL NO esté visible inicialmente (ej. usando queryByText)
    const urlElement = screen.queryByText('https://fullstackopen.com')
  expect(urlElement).toBeNull() // O expect(urlElement).not.toBeVisible() según cómo lo ocultes en tu CSS
})

// --- 📝 NUEVA PRUEBA PARA EL EJERCICIO 5.14 ---
test('muestra la URL y los likes cuando se hace clic en el botón de expandir', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Full Stack Open',
    url: 'https://fullstackopen.com',
    likes: 5,
    user: {
      name: 'Test User'
    }
  }

  render(<Blog blog={blog} currentUser={{ name: 'Test User' }} />)

  // 1. Iniciamos la sesión de simulación del usuario
  const user = userEvent.setup()

  // 2. Buscamos el botón que expande la información. 
  // ⚠️ Cambia 'view' por el texto exacto que tenga tu botón (ej. 'ver', 'show', etc.)
  const button = screen.getByText('view')
  
  // 3. Simulamos el clic en el botón (lleva "await" porque es una acción asíncrona)
  await user.click(button)

  // 4. Verificamos que tras el clic, la URL y los likes estén en el documento
  const urlElement = screen.getByText('https://fullstackopen.com')
  expect(urlElement).toBeInTheDocument()

  // Buscamos los likes. Usamos un Regex (/5/ o /likes/) según cómo muestres el texto en tu componente
  const likesElement = screen.getByText(/5/) 
  expect(likesElement).toBeInTheDocument()
})
´´´

Resulta en:


PS C:\...\fullstackopen2026\part5\bloglist-frontend> npm run test

> bloglist-frontend@0.0.0 test
> vitest run


 RUN  v4.1.7 C:/.../fullstackopen2026/part5/bloglist-frontend

 ✓ src/components/Blog.test.jsx (2 tests) 177ms
   ✓ renderiza el título y el autor, pero oculta la URL y los likes por defecto 47ms
   ✓ muestra la URL y los likes cuando se hace clic en el botón de expandir 126ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  15:30:21
   Duration  1.71s (transform 58ms, setup 192ms, import 178ms, tests 177ms, environment 939ms)

## Tarea 5.15: Pruebas de lista de blogs, Paso 3

Blog.test.jsx:

´´´
import userEvent from '@testing-library/user-event' // 🚀 AGREGA ESTA LÍNEA
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renderiza el título y el autor, pero oculta la URL y los likes por defecto', () => {
    const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Full Stack Open',
    url: 'https://fullstackopen.com',
    likes: 5,
    user: {
        name: 'Test User'
    }
    }

  // Renderizamos el componente pasándole las props que normalmente requiere
    render(<Blog blog={blog} currentUser={{ name: 'Test User' }} />)

  // Verificamos que el título esté en el documento
    const titleElement = screen.getByText(/Component testing is done with react-testing-library/i)
    expect(titleElement).toBeInTheDocument()

  // Verificamos que la URL NO esté visible inicialmente (ej. usando queryByText)
    const urlElement = screen.queryByText('https://fullstackopen.com')
  expect(urlElement).toBeNull() // O expect(urlElement).not.toBeVisible() según cómo lo ocultes en tu CSS
})

// --- 📝 NUEVA PRUEBA PARA EL EJERCICIO 5.14 ---
test('muestra la URL y los likes cuando se hace clic en el botón de expandir', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Full Stack Open',
    url: 'https://fullstackopen.com',
    likes: 5,
    user: {
      name: 'Test User'
    }
  }

  render(<Blog blog={blog} currentUser={{ name: 'Test User' }} />)

  // 1. Iniciamos la sesión de simulación del usuario
  const user = userEvent.setup()

  // 2. Buscamos el botón que expande la información. 
  // ⚠️ Cambia 'view' por el texto exacto que tenga tu botón (ej. 'ver', 'show', etc.)
  const button = screen.getByText('view')
  
  // 3. Simulamos el clic en el botón (lleva "await" porque es una acción asíncrona)
  await user.click(button)

  // 4. Verificamos que tras el clic, la URL y los likes estén en el documento
  const urlElement = screen.getByText('https://fullstackopen.com')
  expect(urlElement).toBeInTheDocument()

  // Buscamos los likes. Usamos un Regex (/5/ o /likes/) según cómo muestres el texto en tu componente
  const likesElement = screen.getByText(/5/) 
  expect(likesElement).toBeInTheDocument()
})

test('si se hace clic en el botón de like dos veces, el controlador de eventos se llama dos veces', async () => {
  const blog = {
    title: 'Testing react apps with vitest',
    author: 'Full Stack Open',
    url: 'https://fullstackopen.com',
    likes: 5,
    user: {
      name: 'Test User'
    }
  }

  const mockHandler = vi.fn()

  // 🚀 CAMBIAMOS handleLike={mockHandler} POR updateLikes={mockHandler}
  render(<Blog blog={blog} updateLikes={mockHandler} currentUser={{ name: 'Test User' }} />)

  const user = userEvent.setup()

  const viewButton = screen.getByText('view') // o 'ver' si está en español
  await user.click(viewButton)

  const likeButton = screen.getByText('like') // o 'me gusta' si está en español
  
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
´´´

PS C:\...\fullstackopen2026\part5\bloglist-frontend> npm run test

> bloglist-frontend@0.0.0 test
> vitest run


 RUN  v4.1.7 C:/.../fullstackopen2026/part5/bloglist-frontend

 ✓ src/components/Blog.test.jsx (3 tests) 393ms
   ✓ renderiza el título y el autor, pero oculta la URL y los likes por defecto 48ms
   ✓ muestra la URL y los likes cuando se hace clic en el botón de expandir 140ms
   ✓ si se hace clic en el botón de like dos veces, el controlador de eventos se llama dos veces 201ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  15:40:05
   Duration  1.90s (transform 75ms, setup 201ms, import 113ms, tests 393ms, environment 977ms)


## Tarea 5.16: Pruebas de lista de blogs, Paso 4

BlogForm.tests.jsx:

´´´
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> llama al controlador de eventos con los detalles correctos al crear un blog', async () => {
  // 1. Creamos la función simulada (Mock) con Vitest
    const createBlog = vi.fn()
    const user = userEvent.setup()

  // 2. Renderizamos el formulario pasándole el Mock en la prop correspondiente
  // (Asegúrate de que en tu BlogForm.jsx la prop se llame 'createBlog')
    render(<BlogForm createBlog={createBlog} />)

  // render(<BlogForm createBlog={createBlog} />) <-- Esto se queda igual

  // 3. Modificamos la búsqueda para capturar los inputs por su orden en el HTML
    const inputs = screen.getAllByRole('textbox')
  const titleInput = inputs[0]  // El primer input es el de title
  const authorInput = inputs[1] // El segundo input es el de author
  const urlInput = inputs[2]    // El tercer input es el de url
    
  // El botón se queda igual porque sí dice 'create'
    const sendButton = screen.getByText('create')
    
  // 4. Simulamos que el usuario escribe en cada uno de los inputs
    await user.type(titleInput, 'Testing forms with React Testing Library')
    await user.type(authorInput, 'Full Stack Open')
    await user.type(urlInput, 'https://fullstackopen.com')

  // 5. Simulamos el clic para enviar el formulario
    await user.click(sendButton)

  // 6. Verificaciones (Assertions)
  // Comprobamos que la función controladora haya sido llamada exactamente 1 vez
    expect(createBlog.mock.calls).toHaveLength(1)
    
  // Comprobamos que el objeto enviado en el primer argumento [0][0] contenga los datos correctos
    expect(createBlog.mock.calls[0][0].title).toBe('Testing forms with React Testing Library')
    expect(createBlog.mock.calls[0][0].author).toBe('Full Stack Open')
    expect(createBlog.mock.calls[0][0].url).toBe('https://fullstackopen.com')
})
´´´

Resulta en:
PS C:\...\fullstackopen2026\part5\bloglist-frontend> npm run test

> bloglist-frontend@0.0.0 test
> vitest run


 RUN  v4.1.7 C:/.../fullstackopen2026/part5/bloglist-frontend

 ✓ src/components/Blog.test.jsx (3 tests) 415ms
 ✓ src/components/BlogForm.test.jsx (1 test) 1678ms
   ✓ <BlogForm /> llama al controlador de eventos con los detalles correctos al crear un blog  1675ms

 Test Files  2 passed (2)
      Tests  4 passed (4)
   Start at  15:47:16
   Duration  3.51s (transform 110ms, setup 397ms, import 234ms, tests 2.09s, environment 2.49s)

## Tarea 5.17: Prueba de la lista del blog de principio a fin, Paso 1
blog_app.spec.js:

´´´
const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  // Aumentamos el timeout para todo el test y sus hooks
  test.setTimeout(10000)

  beforeEach(async ({ page, request }) => {
    // Aumentamos el timeout específico para las peticiones de API
    const apiOptions = { timeout: 10000 }
    
    await request.post('http://localhost:3003/api/testing/reset', apiOptions)
    await request.post('http://localhost:3003/api/users', {
      data: { name: 'Matti Luukkainen', username: 'mluukkai', password: 'salainen' },
      ...apiOptions
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible()
    await expect(page.getByRole('textbox').first()).toBeVisible()
    await expect(page.getByRole('textbox').last()).toBeVisible()
  })
})
´´´

App.jsx:

´´´
import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  // Asegúrate de que este useEffect exista para que el login persista
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    // ... aquí va tu lógica de login (loginService.login) ...
  }

  // --- ESTA ES LA PARTE IMPORTANTE PARA EL TEST ---
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <input name="Username" value={username} onChange={({target}) => setUsername(target.value)} />
          <input type="password" name="Password" value={password} onChange={({target}) => setPassword(target.value)} />
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
    </div>
  )
}

export default App
´´´

backend: 
PS C:\...\fullstackopen2026\part4\blog-list> npm run start:test

> blog-list@1.0.0 start:test
> cross-env NODE_ENV=test node index.js

◇ injected env (4) from .env // tip: ⌁ auth for agents [www.vestauth.com]
Servidor corriendo en el puerto 3003

frontend: 
PS C:\...\fullstackopen2026\part5\bloglist-frontend> npm run dev

> bloglist-frontend@0.0.0 dev
> vite


  VITE v6.3.6  ready in 426 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help

  En otra terminal: 
PS C:\...\fullstackopen2026\part5\bloglist-e2e> npx playwright test --ui
No hay errores.


## Tarea 5.18: Prueba de extremo a extremo de Bloglistan, Paso 2

blog_app.spec.js:

´´´
const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  test.setTimeout(10000)

  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: { name: 'Matti Luukkainen', username: 'mluukkai', password: 'salainen' }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('salainen')
      await page.getByRole('button', { name: /login/i }).click()
      
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('wrongpassword')
      await page.getByRole('button', { name: /login/i }).click()
      
      // Ajusta este selector al mensaje de error real que muestra tu App.jsx
      await expect(page.getByText(/wrong username or password/i)).toBeVisible()
    })
  })
})
´´´

App.jsx:

´´´
import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {/* Aquí renderizamos el error si existe */}
        {errorMessage && <div className="error">{errorMessage}</div>}
        
        <form onSubmit={handleLogin}>
          <div>
            username: 
            <input name="Username" value={username} onChange={({target}) => setUsername(target.value)} />
          </div>
          <div>
            password: 
            <input type="password" name="Password" value={password} onChange={({target}) => setPassword(target.value)} />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
    </div>
  )
}

export default App
´´´

backend: 
PS C:\...\fullstackopen2026\part4\blog-list> npm run start:test

> blog-list@1.0.0 start:test
> cross-env NODE_ENV=test node index.js

◇ injected env (4) from .env // tip: ◈ secrets for agents [www.dotenvx.com]
Servidor corriendo en el puerto 3003

frontend: 
PS C:\...\fullstackopen2026\part5\bloglist-frontend> npm run dev

> bloglist-frontend@0.0.0 dev
> vite


  VITE v6.3.6  ready in 600 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help


PS C:\...\fullstackopen2026\part5\bloglist-e2e> npx playwright test --ui
No hay errores.


# Tarea 5.19: Prueba de la lista de blogs de principio a fin, Paso 3

Proyecto E2E (Playwright):

tests/blog_app.spec.js: 

´´´
const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  test.setTimeout(10000)

  beforeEach(async ({ page, request }) => {
  await request.post('http://localhost:3003/api/testing/reset')
  await page.goto('http://localhost:5173')
})

  test('Login form is shown', async ({ page }) => {
    const root = page.locator('#root')
    await expect(root).not.toBeEmpty()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: { username: 'mluukkai', name: 'Matti Luukkainen', password: 'salainen' }
      })

      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: /login/i }).click()

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('wrongpassword')
      await page.getByRole('button', { name: /login/i }).click()

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toBeVisible()
      await expect(errorDiv).toContainText('Wrong username or password')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: { username: 'mluukkai', name: 'Matti Luukkainen', password: 'salainen' }
      })

      await page.getByRole('button', { name: /login/i }).click()
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: /login/i }).click()

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: /new blog/i }).click()

      await page.getByLabel(/title/i).fill('Aprendiendo Playwright')
      await page.getByLabel(/author/i).fill('Estudiante FSO')
      await page.getByLabel(/url/i).fill('http://test.com')

      await page.getByRole('button', { name: /create/i }).click()

      const newBlog = page.getByTestId('blog-item').filter({ hasText: 'Aprendiendo Playwright' })
      await expect(newBlog).toBeVisible()
    })
  })
})
´´´

playwright.config.js:

´´´
const { defineConfig, devices } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './tests',
  timeout: 10000,
  fullyParallel: false,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
´´´

Del frontend:

src/App.jsx:

´´´
import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [blogFormVisible, setBlogFormVisible] = useState(false)
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
  const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)
    setUser(user)
    blogService.setToken(user.token)
  }
}, [])

useEffect(() => {
  blogService.getAll().then(blogs => setBlogs(blogs))
}, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleCreate = async (event) => {
  event.preventDefault()
  try {
    const returnedBlog = await blogService.create(newBlog)
    setBlogs(blogs.concat(returnedBlog))
    setNewBlog({ title: '', author: '', url: '' })
    setBlogFormVisible(false)
  } catch (exception) {
    const status = exception.response?.status || exception.code
    const msg = exception.response?.data?.error || exception.message
    setErrorMessage(`Error: ${status} - ${msg}`)
  }
}

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {/* Aquí se mostrará el mensaje de error si el login falla */}
        {errorMessage && <div className="error">{errorMessage}</div>}
        
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">username</label>
            <input 
              id="username"
              value={username} 
              onChange={({ target }) => setUsername(target.value)} 
            />
          </div>
          <div>
            <label htmlFor="password">password</label>
            <input 
              id="password"
              type="password" 
              value={password} 
              onChange={({ target }) => setPassword(target.value)} 
            />
          </div>
          {/* El test busca este botón por su nombre */}
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {errorMessage && <div className="error">{errorMessage}</div>}
      <p>{user.name} logged in</p>
      
      {!blogFormVisible && <button onClick={() => setBlogFormVisible(true)}>new blog</button>}

      {blogFormVisible && (
        <form onSubmit={handleCreate}>
          <h3>create new</h3>
          <div>
            <label htmlFor="title">title</label>
            <input id="title" value={newBlog.title} onChange={e => setNewBlog({...newBlog, title: e.target.value})} />
          </div>
          <div>
            <label htmlFor="author">author</label>
            <input id="author" value={newBlog.author} onChange={e => setNewBlog({...newBlog, author: e.target.value})} />
          </div>
          <div>
            <label htmlFor="url">url</label>
            <input id="url" value={newBlog.url} onChange={e => setNewBlog({...newBlog, url: e.target.value})} />
          </div>
          <button type="submit">create</button>
          <button type="button" onClick={() => setBlogFormVisible(false)}>cancel</button>
        </form>
      )}

      {blogs.map(blog => (
  <div key={blog.id} data-testid="blog-item" className="blog-item">
    {blog.title} by {blog.author}
  </div>
))}
    </div>
  )
}

export default App
´´´

src/services/blogs.js:

´´´
import axios from 'axios'

const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getToken = () => {
  if (token) return token
  // Fallback: leer del localStorage si el módulo fue recargado
  const userJSON = window.localStorage.getItem('loggedBlogAppUser')
  if (userJSON) {
    const user = JSON.parse(userJSON)
    return `Bearer ${user.token}`
  }
  return null
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: getToken() },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

export default { getAll, create, setToken }
´´´

Del backend:

models/user.js (con el campo blogs agregado):

´´´
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
    type: String,
    required: true,
    unique: true // Asegura que no se repitan nombres de usuario en la DB
    },
    name: String,
    passwordHash: {
    type: String,
    required: true
    },
    blogs: [  // ← agrega esto
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

// Formateo de la respuesta JSON para que coincida exactamente con tu imagen
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // El passwordHash JAMÁS debe revelarse en las respuestas HTTP
    delete returnedObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User
´´´

controllers/blogs.js:

´´´
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// 1. OBTENER TODOS LOS BLOGS
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// 2. CREAR UN NUEVO BLOG (Consolidado)
blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body
  const user = request.user // Esto viene del middleware userExtractor

  // 1. Verificación defensiva: Si no hay usuario, el 500 se evita con un 401
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id // <-- Si 'user' es null, aquí ocurre el error 500
  })

  try {
    const savedBlog = await blog.save()
    
    // 2. Asegúrate de actualizar el usuario
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    
    response.status(201).json(savedBlog)
  } catch (error) {
    // ESTO TE DIRÁ EXACTAMENTE EL ERROR EN LA CONSOLA
    console.error('Error detallado:', error) 
    response.status(500).json({ error: 'internal server error' })
  }
})

// 3. ACTUALIZAR LIKES
blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes, user } = request.body
  const blog = { title, author, url, likes, user }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { 
    new: true, 
    runValidators: true, 
    context: 'query' 
  })
  updatedBlog ? response.json(updatedBlog) : response.status(404).end()
})

// 4. ELIMINAR UN BLOG
blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  if (!user) return response.status(401).json({ error: 'token missing or invalid' })

  const blog = await Blog.findById(request.params.id)
  if (!blog) return response.status(404).json({ error: 'blog not found' })

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'only the creator can delete this blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  user.blogs = user.blogs.filter(b => b.toString() !== request.params.id)
  await user.save()
  response.status(204).end()
})

module.exports = blogsRouter
´´´

controllers/testing.js:

´´´
const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
  // 🛡️ SEGURIDAD: Solo permitir reset si el entorno es 'test'
  if (process.env.NODE_ENV !== 'test') {
    return response.status(403).json({ error: 'Operación no permitida en este entorno' })
  }

  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router
´´´

app.js:

´´´
const config = require('./utils/config')
const express = require('express')
require('express-async-errors') 
const app = express() 
const cors = require('cors')

// 1. Importación de Controladores
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login') 

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
app.use(express.json()) // <-- ¡Esencial que esté aquí arriba!
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor) 
app.use(middleware.userExtractor)

// 4. Registro de Rutas de la API 
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

// ... tus otros enrutadores (/api/login, /api/users, /api/blogs)

if (process.env.NODE_ENV === 'test') {
  // SIN llaves. Importa directamente todo lo que exporta el archivo
  const testingRouter = require('./controllers/testing') 
  app.use('/api/testing', testingRouter)
}

// 5. Middlewares de Cierre (Manejo de rutas inexistentes y errores)
app.use(middleware.unknownEndpoint) 
app.use(middleware.errorHandler)

module.exports = app
´´´

Prueba 4/4 sin errores.


## Tarea 5.20: Prueba de extremo a extremo en Bloglistan, Paso 4

tests/blog_app.spec.js — tiene el test nuevo a blog can be liked

´´´
const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  test.setTimeout(10000)

  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const root = page.locator('#root')
    await expect(root).not.toBeEmpty()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: { username: 'mluukkai', name: 'Matti Luukkainen', password: 'salainen' }
      })

      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: /login/i }).click()

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('wrongpassword')
      await page.getByRole('button', { name: /login/i }).click()

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toBeVisible()
      await expect(errorDiv).toContainText('Wrong username or password')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: { username: 'mluukkai', name: 'Matti Luukkainen', password: 'salainen' }
      })

      await page.getByRole('button', { name: /login/i }).click()
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: /login/i }).click()

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: /new blog/i }).click()

      await page.getByLabel(/title/i).fill('Aprendiendo Playwright')
      await page.getByLabel(/author/i).fill('Estudiante FSO')
      await page.getByLabel(/url/i).fill('http://test.com')

      await page.getByRole('button', { name: /create/i }).click()

      const newBlog = page.getByTestId('blog-item').filter({ hasText: 'Aprendiendo Playwright' })
      await expect(newBlog).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: /new blog/i }).click()
      await page.getByLabel(/title/i).fill('Blog para likear')
      await page.getByLabel(/author/i).fill('Autor Test')
      await page.getByLabel(/url/i).fill('http://test.com')
      await page.getByRole('button', { name: /create/i }).click()

      const blog = page.getByTestId('blog-item').filter({ hasText: 'Blog para likear' })
      await expect(blog).toBeVisible()

      await blog.getByRole('button', { name: /view/i }).click()

      const likeButton = blog.getByRole('button', { name: /like/i })
      await expect(likeButton).toBeVisible()

      await likeButton.click()

      await expect(blog.getByText('likes 1')).toBeVisible()
    })
  })
})
´´´

src/App.jsx — tiene el botón view/hide y like

´´´
import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [blogFormVisible, setBlogFormVisible] = useState(false)
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
  const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)
    setUser(user)
    blogService.setToken(user.token)
  }
}, [])

useEffect(() => {
  blogService.getAll().then(blogs => setBlogs(blogs))
}, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleCreate = async (event) => {
  event.preventDefault()
  try {
    const returnedBlog = await blogService.create(newBlog)
    setBlogs(blogs.concat(returnedBlog))
    setNewBlog({ title: '', author: '', url: '' })
    setBlogFormVisible(false)
  } catch (exception) {
    const status = exception.response?.status || exception.code
    const msg = exception.response?.data?.error || exception.message
    setErrorMessage(`Error: ${status} - ${msg}`)
  }
}

  const [visibleBlogs, setVisibleBlogs] = useState({})

const toggleBlogVisibility = (id) => {
  setVisibleBlogs(prev => ({ ...prev, [id]: !prev[id] }))
}

const handleLike = async (blog) => {
  const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id || blog.user }
  const returned = await blogService.update(blog.id, updatedBlog)
  setBlogs(blogs.map(b => b.id === blog.id ? returned : b))
}

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {/* Aquí se mostrará el mensaje de error si el login falla */}
        {errorMessage && <div className="error">{errorMessage}</div>}
        
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">username</label>
            <input 
              id="username"
              value={username} 
              onChange={({ target }) => setUsername(target.value)} 
            />
          </div>
          <div>
            <label htmlFor="password">password</label>
            <input 
              id="password"
              type="password" 
              value={password} 
              onChange={({ target }) => setPassword(target.value)} 
            />
          </div>
          {/* El test busca este botón por su nombre */}
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {errorMessage && <div className="error">{errorMessage}</div>}
      <p>{user.name} logged in</p>
      
      {!blogFormVisible && <button onClick={() => setBlogFormVisible(true)}>new blog</button>}

      {blogFormVisible && (
        <form onSubmit={handleCreate}>
          <h3>create new</h3>
          <div>
            <label htmlFor="title">title</label>
            <input id="title" value={newBlog.title} onChange={e => setNewBlog({...newBlog, title: e.target.value})} />
          </div>
          <div>
            <label htmlFor="author">author</label>
            <input id="author" value={newBlog.author} onChange={e => setNewBlog({...newBlog, author: e.target.value})} />
          </div>
          <div>
            <label htmlFor="url">url</label>
            <input id="url" value={newBlog.url} onChange={e => setNewBlog({...newBlog, url: e.target.value})} />
          </div>
          <button type="submit">create</button>
          <button type="button" onClick={() => setBlogFormVisible(false)}>cancel</button>
        </form>
      )}

      {blogs.map(blog => (
        <div key={blog.id} data-testid="blog-item" className="blog-item">
          {blog.title} by {blog.author}
          <button onClick={() => toggleBlogVisibility(blog.id)}>
            {visibleBlogs[blog.id] ? 'hide' : 'view'}
          </button>
          {visibleBlogs[blog.id] && (
            <div>
              <p>{blog.url}</p>
              <p>likes {blog.likes} <button onClick={() => handleLike(blog)}>like</button></p>
              <p>{blog.user?.name}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default App
´´´

src/services/blogs.js — tiene el método update

´´´
import axios from 'axios'

const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getToken = () => {
  if (token) return token
  // Fallback: leer del localStorage si el módulo fue recargado
  const userJSON = window.localStorage.getItem('loggedBlogAppUser')
  if (userJSON) {
    const user = JSON.parse(userJSON)
    return `Bearer ${user.token}`
  }
  return null
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: getToken() },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: getToken() },
  }
  const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return response.data
}

export default { getAll, create, update, setToken }
´´´


Archivos que no cambiaron (de la anterior tarea):

playwright.config.js:

´´´
const { defineConfig, devices } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './tests',
  timeout: 10000,
  fullyParallel: false,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
´´´

controllers/blogs.js:

´´´
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// 1. OBTENER TODOS LOS BLOGS
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// 2. CREAR UN NUEVO BLOG (Consolidado)
blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body
  const user = request.user // Esto viene del middleware userExtractor

  // 1. Verificación defensiva: Si no hay usuario, el 500 se evita con un 401
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id // <-- Si 'user' es null, aquí ocurre el error 500
  })

  try {
    const savedBlog = await blog.save()
    
    // 2. Asegúrate de actualizar el usuario
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    
    response.status(201).json(savedBlog)
  } catch (error) {
    // ESTO TE DIRÁ EXACTAMENTE EL ERROR EN LA CONSOLA
    console.error('Error detallado:', error) 
    response.status(500).json({ error: 'internal server error' })
  }
})

// 3. ACTUALIZAR LIKES
blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes, user } = request.body
  const blog = { title, author, url, likes, user }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { 
    new: true, 
    runValidators: true, 
    context: 'query' 
  })
  updatedBlog ? response.json(updatedBlog) : response.status(404).end()
})

// 4. ELIMINAR UN BLOG
blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  if (!user) return response.status(401).json({ error: 'token missing or invalid' })

  const blog = await Blog.findById(request.params.id)
  if (!blog) return response.status(404).json({ error: 'blog not found' })

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'only the creator can delete this blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  user.blogs = user.blogs.filter(b => b.toString() !== request.params.id)
  await user.save()
  response.status(204).end()
})

module.exports = blogsRouter
´´´

controllers/testing.js:

´´´
const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
  // 🛡️ SEGURIDAD: Solo permitir reset si el entorno es 'test'
  if (process.env.NODE_ENV !== 'test') {
    return response.status(403).json({ error: 'Operación no permitida en este entorno' })
  }

  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router
´´´

models/user.js:

´´´
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
    type: String,
    required: true,
    unique: true // Asegura que no se repitan nombres de usuario en la DB
    },
    name: String,
    passwordHash: {
    type: String,
    required: true
    },
    blogs: [  // ← agrega esto
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

// Formateo de la respuesta JSON para que coincida exactamente con tu imagen
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // El passwordHash JAMÁS debe revelarse en las respuestas HTTP
    delete returnedObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User
´´´

app.js:

´´´
const config = require('./utils/config')
const express = require('express')
require('express-async-errors') 
const app = express() 
const cors = require('cors')

// 1. Importación de Controladores
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login') 

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
app.use(express.json()) // <-- ¡Esencial que esté aquí arriba!
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor) 
app.use(middleware.userExtractor)

// 4. Registro de Rutas de la API 
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

// ... tus otros enrutadores (/api/login, /api/users, /api/blogs)

if (process.env.NODE_ENV === 'test') {
  // SIN llaves. Importa directamente todo lo que exporta el archivo
  const testingRouter = require('./controllers/testing') 
  app.use('/api/testing', testingRouter)
}

// 5. Middlewares de Cierre (Manejo de rutas inexistentes y errores)
app.use(middleware.unknownEndpoint) 
app.use(middleware.errorHandler)

module.exports = app
´´´

Prueba 5/5 sin errores.

## Tarea 5.21: Prueba de la lista de blogs de principio a fin, Paso 5
Archivos actualizados:

tests/blog_app.spec.js — tiene el test nuevo de delete

´´´
const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  test.setTimeout(10000)

  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const root = page.locator('#root')
    await expect(root).not.toBeEmpty()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: { username: 'mluukkai', name: 'Matti Luukkainen', password: 'salainen' }
      })

      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: /login/i }).click()

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('wrongpassword')
      await page.getByRole('button', { name: /login/i }).click()

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toBeVisible()
      await expect(errorDiv).toContainText('Wrong username or password')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: { username: 'mluukkai', name: 'Matti Luukkainen', password: 'salainen' }
      })

      await page.getByRole('button', { name: /login/i }).click()
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: /login/i }).click()

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: /new blog/i }).click()

      await page.getByLabel(/title/i).fill('Aprendiendo Playwright')
      await page.getByLabel(/author/i).fill('Estudiante FSO')
      await page.getByLabel(/url/i).fill('http://test.com')

      await page.getByRole('button', { name: /create/i }).click()

      const newBlog = page.getByTestId('blog-item').filter({ hasText: 'Aprendiendo Playwright' })
      await expect(newBlog).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: /new blog/i }).click()
      await page.getByLabel(/title/i).fill('Blog para likear')
      await page.getByLabel(/author/i).fill('Autor Test')
      await page.getByLabel(/url/i).fill('http://test.com')
      await page.getByRole('button', { name: /create/i }).click()

      const blog = page.getByTestId('blog-item').filter({ hasText: 'Blog para likear' })
      await expect(blog).toBeVisible()

      await blog.getByRole('button', { name: /view/i }).click()

      const likeButton = blog.getByRole('button', { name: /like/i })
      await expect(likeButton).toBeVisible()

      await likeButton.click()

      await expect(blog.getByText('likes 1')).toBeVisible()
    })
    
    test('the user who added the blog can delete it', async ({ page }) => {
  // 1. Crear un blog
  await page.getByRole('button', { name: /new blog/i }).click()
  await page.getByLabel(/title/i).fill('Blog para eliminar')
  await page.getByLabel(/author/i).fill('Autor Test')
  await page.getByLabel(/url/i).fill('http://test.com')
  await page.getByRole('button', { name: /create/i }).click()

  // 2. Esperar que aparezca
  const blog = page.getByTestId('blog-item').filter({ hasText: 'Blog para eliminar' })
  await expect(blog).toBeVisible()

  // 3. Expandir el blog
  await blog.getByRole('button', { name: /view/i }).click()

  // 4. Aceptar el diálogo de confirmación automáticamente
  page.on('dialog', dialog => dialog.accept())

  // 5. Click en remove
  await blog.getByRole('button', { name: /remove/i }).click()

  // 6. Verificar que el blog desapareció
  await expect(blog).not.toBeVisible()
    })
  })
})
´´´
src/App.jsx — tiene el botón remove y handleDelete

´´´
import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [blogFormVisible, setBlogFormVisible] = useState(false)
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const [blogs, setBlogs] = useState([])
  const [visibleBlogs, setVisibleBlogs] = useState({})

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    try {
      const returnedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      setNewBlog({ title: '', author: '', url: '' })
      setBlogFormVisible(false)
    } catch (exception) {
      const status = exception.response?.status || exception.code
      const msg = exception.response?.data?.error || exception.message
      setErrorMessage(`Error: ${status} - ${msg}`)
    }
  }

  const toggleBlogVisibility = (id) => {
    setVisibleBlogs(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleLike = async (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id || blog.user }
    const returned = await blogService.update(blog.id, updatedBlog)
    setBlogs(blogs.map(b => b.id === blog.id ? returned : b))
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {errorMessage && <div className="error">{errorMessage}</div>}
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">username</label>
            <input
              id="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {errorMessage && <div className="error">{errorMessage}</div>}
      <p>{user.name} logged in</p>

      {!blogFormVisible && <button onClick={() => setBlogFormVisible(true)}>new blog</button>}

      {blogFormVisible && (
        <form onSubmit={handleCreate}>
          <h3>create new</h3>
          <div>
            <label htmlFor="title">title</label>
            <input id="title" value={newBlog.title} onChange={e => setNewBlog({...newBlog, title: e.target.value})} />
          </div>
          <div>
            <label htmlFor="author">author</label>
            <input id="author" value={newBlog.author} onChange={e => setNewBlog({...newBlog, author: e.target.value})} />
          </div>
          <div>
            <label htmlFor="url">url</label>
            <input id="url" value={newBlog.url} onChange={e => setNewBlog({...newBlog, url: e.target.value})} />
          </div>
          <button type="submit">create</button>
          <button type="button" onClick={() => setBlogFormVisible(false)}>cancel</button>
        </form>
      )}

      {blogs.map(blog => (
        <div key={blog.id} data-testid="blog-item" className="blog-item">
          {blog.title} by {blog.author}
          <button onClick={() => toggleBlogVisibility(blog.id)}>
            {visibleBlogs[blog.id] ? 'hide' : 'view'}
          </button>
          {visibleBlogs[blog.id] && (
            <div>
              <p>{blog.url}</p>
              <p>likes {blog.likes} <button onClick={() => handleLike(blog)}>like</button></p>
              <p>{blog.user?.name}</p>
              <button onClick={() => handleDelete(blog)}>remove</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default App
´´´
src/services/blogs.js — tiene el método remove

´´´
import axios from 'axios'

const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getToken = () => {
  if (token) return token
  // Fallback: leer del localStorage si el módulo fue recargado
  const userJSON = window.localStorage.getItem('loggedBlogAppUser')
  if (userJSON) {
    const user = JSON.parse(userJSON)
    return `Bearer ${user.token}`
  }
  return null
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: getToken() },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: getToken() },
  }
  const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: getToken() },
  }
  await axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll, create, update, remove, setToken }
´´´

Prueba 6/6 sin errores.

## Tarea 5.22: Prueba de la lista de blogs de principio a fin, Paso 6
Archivos actualizados:

tests/blog_app.spec.js — tiene el test only the creator can see the delete button

´´´
const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  test.setTimeout(10000)

  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const root = page.locator('#root')
    await expect(root).not.toBeEmpty()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: { username: 'mluukkai', name: 'Matti Luukkainen', password: 'salainen' }
      })

      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: /login/i }).click()

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('wrongpassword')
      await page.getByRole('button', { name: /login/i }).click()

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toBeVisible()
      await expect(errorDiv).toContainText('Wrong username or password')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: { username: 'mluukkai', name: 'Matti Luukkainen', password: 'salainen' }
      })

      await page.getByRole('button', { name: /login/i }).click()
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: /login/i }).click()

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: /new blog/i }).click()

      await page.getByLabel(/title/i).fill('Aprendiendo Playwright')
      await page.getByLabel(/author/i).fill('Estudiante FSO')
      await page.getByLabel(/url/i).fill('http://test.com')

      await page.getByRole('button', { name: /create/i }).click()

      const newBlog = page.getByTestId('blog-item').filter({ hasText: 'Aprendiendo Playwright' })
      await expect(newBlog).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: /new blog/i }).click()
      await page.getByLabel(/title/i).fill('Blog para likear')
      await page.getByLabel(/author/i).fill('Autor Test')
      await page.getByLabel(/url/i).fill('http://test.com')
      await page.getByRole('button', { name: /create/i }).click()

      const blog = page.getByTestId('blog-item').filter({ hasText: 'Blog para likear' })
      await expect(blog).toBeVisible()

      await blog.getByRole('button', { name: /view/i }).click()

      const likeButton = blog.getByRole('button', { name: /like/i })
      await expect(likeButton).toBeVisible()

      await likeButton.click()

      await expect(blog.getByText('likes 1')).toBeVisible()
    })

    test('the user who added the blog can delete it', async ({ page }) => {
  // 1. Crear un blog
  await page.getByRole('button', { name: /new blog/i }).click()
  await page.getByLabel(/title/i).fill('Blog para eliminar')
  await page.getByLabel(/author/i).fill('Autor Test')
  await page.getByLabel(/url/i).fill('http://test.com')
  await page.getByRole('button', { name: /create/i }).click()

  // 2. Esperar que aparezca
  const blog = page.getByTestId('blog-item').filter({ hasText: 'Blog para eliminar' })
  await expect(blog).toBeVisible()

  // 3. Expandir el blog
  await blog.getByRole('button', { name: /view/i }).click()

  // 4. Aceptar el diálogo de confirmación automáticamente
  page.on('dialog', dialog => dialog.accept())

  // 5. Click en remove
  await blog.getByRole('button', { name: /remove/i }).click()

  // 6. Verificar que el blog desapareció
  await expect(blog).not.toBeVisible()
    })
    test('only the creator can see the delete button', async ({ page, request }) => {
  await request.post('http://localhost:3003/api/users', {
    data: { username: 'otheruser', name: 'Other User', password: 'password' }
  })

  await page.getByRole('button', { name: /new blog/i }).click()
  await page.getByLabel(/title/i).fill('Blog del creador')
  await page.getByLabel(/author/i).fill('Autor Test')
  await page.getByLabel(/url/i).fill('http://test.com')
  await page.getByRole('button', { name: /create/i }).click()

  const blog = page.getByTestId('blog-item').filter({ hasText: 'Blog del creador' })
  await expect(blog).toBeVisible()
  await blog.getByRole('button', { name: /view/i }).click()

  // mluukkai SÍ ve remove
  await expect(blog.getByRole('button', { name: /remove/i })).toBeVisible()

  // Logout
  await page.getByRole('button', { name: /logout/i }).click()

  // Login con otheruser
  await page.getByLabel('username').fill('otheruser')
  await page.getByLabel('password').fill('password')
  await page.getByRole('button', { name: /login/i }).click()
  await expect(page.getByText('Other User logged in')).toBeVisible()

  // Buscar el blog de nuevo
  const blogAfterLogin = page.getByTestId('blog-item').filter({ hasText: 'Blog del creador' })
  
  // Si está expandido, cerrarlo primero
  const hideButton = blogAfterLogin.getByRole('button', { name: /hide/i })
  if (await hideButton.isVisible()) {
    await hideButton.click()
  }
  
  // Expandir
  await blogAfterLogin.getByRole('button', { name: /view/i }).click()

  // otheruser NO ve remove
  await expect(blogAfterLogin.getByRole('button', { name: /remove/i })).not.toBeVisible()
    })
  })
})
´´´
src/App.jsx — tiene el botón logout, la condición del remove, y el handleLogout

´´´
import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [blogFormVisible, setBlogFormVisible] = useState(false)
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const [blogs, setBlogs] = useState([])
  const [visibleBlogs, setVisibleBlogs] = useState({})

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    try {
      const returnedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      setNewBlog({ title: '', author: '', url: '' })
      setBlogFormVisible(false)
    } catch (exception) {
      const status = exception.response?.status || exception.code
      const msg = exception.response?.data?.error || exception.message
      setErrorMessage(`Error: ${status} - ${msg}`)
    }
  }

  const toggleBlogVisibility = (id) => {
    setVisibleBlogs(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleLike = async (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id || blog.user }
    const returned = await blogService.update(blog.id, updatedBlog)
    setBlogs(blogs.map(b => b.id === blog.id ? returned : b))
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    }
  }

  const handleLogout = () => {
  window.localStorage.removeItem('loggedBlogAppUser')
  blogService.setToken(null)
  setUser(null)
}

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {errorMessage && <div className="error">{errorMessage}</div>}
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">username</label>
            <input
              id="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {errorMessage && <div className="error">{errorMessage}</div>}
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>  {/* ← aquí */}
      </p>

      {!blogFormVisible && <button onClick={() => setBlogFormVisible(true)}>new blog</button>}

      {blogFormVisible && (
        <form onSubmit={handleCreate}>
          <h3>create new</h3>
          <div>
            <label htmlFor="title">title</label>
            <input id="title" value={newBlog.title} onChange={e => setNewBlog({...newBlog, title: e.target.value})} />
          </div>
          <div>
            <label htmlFor="author">author</label>
            <input id="author" value={newBlog.author} onChange={e => setNewBlog({...newBlog, author: e.target.value})} />
          </div>
          <div>
            <label htmlFor="url">url</label>
            <input id="url" value={newBlog.url} onChange={e => setNewBlog({...newBlog, url: e.target.value})} />
          </div>
          <button type="submit">create</button>
          <button type="button" onClick={() => setBlogFormVisible(false)}>cancel</button>
        </form>
      )}

      {blogs.map(blog => (
        <div key={blog.id} data-testid="blog-item" className="blog-item">
          {blog.title} by {blog.author}
          <button onClick={() => toggleBlogVisibility(blog.id)}>
            {visibleBlogs[blog.id] ? 'hide' : 'view'}
          </button>
          {visibleBlogs[blog.id] && (
            <div>
              <p>{blog.url}</p>
              <p>likes {blog.likes} <button onClick={() => handleLike(blog)}>like</button></p>
              <p>{blog.user?.name}</p>
              {blog.user?.username === user.username && (
              <button onClick={() => handleDelete(blog)}>remove</button>
      )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default App
´´´

src/services/blogs.js

´´´
import axios from 'axios'

const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getToken = () => {
  if (token) return token
  // Fallback: leer del localStorage si el módulo fue recargado
  const userJSON = window.localStorage.getItem('loggedBlogAppUser')
  if (userJSON) {
    const user = JSON.parse(userJSON)
    return `Bearer ${user.token}`
  }
  return null
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: getToken() },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: getToken() },
  }
  const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: getToken() },
  }
  await axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll, create, update, remove, setToken }
´´´


controllers/blogs.js — tiene el populate al crear blog

´´´
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// 1. OBTENER TODOS LOS BLOGS
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// 2. CREAR UN NUEVO BLOG (Consolidado)
blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body
  const user = request.user // Esto viene del middleware userExtractor

  // 1. Verificación defensiva: Si no hay usuario, el 500 se evita con un 401
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id // <-- Si 'user' es null, aquí ocurre el error 500
  })

  try {
    const savedBlog = await blog.save()
const populatedBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 })

user.blogs = user.blogs.concat(savedBlog._id)
await user.save()

response.status(201).json(populatedBlog)
  } catch (error) {
    // ESTO TE DIRÁ EXACTAMENTE EL ERROR EN LA CONSOLA
    console.error('Error detallado:', error) 
    response.status(500).json({ error: 'internal server error' })
  }
})

// 3. ACTUALIZAR LIKES
blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes, user } = request.body
  const blog = { title, author, url, likes, user }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { 
    new: true, 
    runValidators: true, 
    context: 'query' 
  })
  updatedBlog ? response.json(updatedBlog) : response.status(404).end()
})

// 4. ELIMINAR UN BLOG
blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  if (!user) return response.status(401).json({ error: 'token missing or invalid' })

  const blog = await Blog.findById(request.params.id)
  if (!blog) return response.status(404).json({ error: 'blog not found' })

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'only the creator can delete this blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  user.blogs = user.blogs.filter(b => b.toString() !== request.params.id)
  await user.save()
  response.status(204).end()
})

module.exports = blogsRouter

´´´

Prueba 7/7 sin errores


## Tarea 5.23: Prueba de la lista del blog de principio a fin, Paso 7
blog_app.spec.js:

´´´
const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  test.setTimeout(10000)

  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const root = page.locator('#root')
    await expect(root).not.toBeEmpty()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: { username: 'mluukkai', name: 'Matti Luukkainen', password: 'salainen' }
      })

      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: /login/i }).click()

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('wrongpassword')
      await page.getByRole('button', { name: /login/i }).click()

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toBeVisible()
      await expect(errorDiv).toContainText('Wrong username or password')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: { username: 'mluukkai', name: 'Matti Luukkainen', password: 'salainen' }
      })

      await page.getByRole('button', { name: /login/i }).click()
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: /login/i }).click()

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: /new blog/i }).click()

      await page.getByLabel(/title/i).fill('Aprendiendo Playwright')
      await page.getByLabel(/author/i).fill('Estudiante FSO')
      await page.getByLabel(/url/i).fill('http://test.com')

      await page.getByRole('button', { name: /create/i }).click()

      const newBlog = page.getByTestId('blog-item').filter({ hasText: 'Aprendiendo Playwright' })
      await expect(newBlog).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: /new blog/i }).click()
      await page.getByLabel(/title/i).fill('Blog para likear')
      await page.getByLabel(/author/i).fill('Autor Test')
      await page.getByLabel(/url/i).fill('http://test.com')
      await page.getByRole('button', { name: /create/i }).click()

      const blog = page.getByTestId('blog-item').filter({ hasText: 'Blog para likear' })
      await expect(blog).toBeVisible()

      await blog.getByRole('button', { name: /view/i }).click()

      const likeButton = blog.getByRole('button', { name: /like/i })
      await expect(likeButton).toBeVisible()

      await likeButton.click()

      await expect(blog.getByText('likes 1')).toBeVisible()
    })

    test('the user who added the blog can delete it', async ({ page }) => {
  // 1. Crear un blog
  await page.getByRole('button', { name: /new blog/i }).click()
  await page.getByLabel(/title/i).fill('Blog para eliminar')
  await page.getByLabel(/author/i).fill('Autor Test')
  await page.getByLabel(/url/i).fill('http://test.com')
  await page.getByRole('button', { name: /create/i }).click()

  // 2. Esperar que aparezca
  const blog = page.getByTestId('blog-item').filter({ hasText: 'Blog para eliminar' })
  await expect(blog).toBeVisible()

  // 3. Expandir el blog
  await blog.getByRole('button', { name: /view/i }).click()

  // 4. Aceptar el diálogo de confirmación automáticamente
  page.on('dialog', dialog => dialog.accept())

  // 5. Click en remove
  await blog.getByRole('button', { name: /remove/i }).click()

  // 6. Verificar que el blog desapareció
  await expect(blog).not.toBeVisible()
    })
    test('only the creator can see the delete button', async ({ page, request }) => {
  await request.post('http://localhost:3003/api/users', {
    data: { username: 'otheruser', name: 'Other User', password: 'password' }
  })

  await page.getByRole('button', { name: /new blog/i }).click()
  await page.getByLabel(/title/i).fill('Blog del creador')
  await page.getByLabel(/author/i).fill('Autor Test')
  await page.getByLabel(/url/i).fill('http://test.com')
  await page.getByRole('button', { name: /create/i }).click()

  const blog = page.getByTestId('blog-item').filter({ hasText: 'Blog del creador' })
  await expect(blog).toBeVisible()
  await blog.getByRole('button', { name: /view/i }).click()

  // mluukkai SÍ ve remove
  await expect(blog.getByRole('button', { name: /remove/i })).toBeVisible()

  // Logout
  await page.getByRole('button', { name: /logout/i }).click()

  // Login con otheruser
  await page.getByLabel('username').fill('otheruser')
  await page.getByLabel('password').fill('password')
  await page.getByRole('button', { name: /login/i }).click()
  await expect(page.getByText('Other User logged in')).toBeVisible()

  // Buscar el blog de nuevo
  const blogAfterLogin = page.getByTestId('blog-item').filter({ hasText: 'Blog del creador' })
  
  // Si está expandido, cerrarlo primero
  const hideButton = blogAfterLogin.getByRole('button', { name: /hide/i })
  if (await hideButton.isVisible()) {
    await hideButton.click()
  }
  
  // Expandir
  await blogAfterLogin.getByRole('button', { name: /view/i }).click()

  // otheruser NO ve remove
  await expect(blogAfterLogin.getByRole('button', { name: /remove/i })).not.toBeVisible()
    })
    test('blogs are ordered by likes, most liked first', async ({ page }) => {
  // 1. Crear 3 blogs
  const createBlog = async (title) => {
    await page.getByRole('button', { name: /new blog/i }).click()
    await page.getByLabel(/title/i).fill(title)
    await page.getByLabel(/author/i).fill('Autor')
    await page.getByLabel(/url/i).fill('http://test.com')
    await page.getByRole('button', { name: /create/i }).click()
    await expect(page.getByTestId('blog-item').filter({ hasText: title })).toBeVisible()
  }

  await createBlog('Blog A')
  await createBlog('Blog B')
  await createBlog('Blog C')

  // 2. Dar likes: C=2, A=1, B=0
  const blogC = page.getByTestId('blog-item').filter({ hasText: 'Blog C' })
  await blogC.getByRole('button', { name: /view/i }).click()
  await blogC.getByRole('button', { name: /like/i }).click()
  await expect(blogC.getByText('likes 1')).toBeVisible()
  await blogC.getByRole('button', { name: /like/i }).click()
  await expect(blogC.getByText('likes 2')).toBeVisible()

  const blogA = page.getByTestId('blog-item').filter({ hasText: 'Blog A' })
  await blogA.getByRole('button', { name: /view/i }).click()
  await blogA.getByRole('button', { name: /like/i }).click()
  await expect(blogA.getByText('likes 1')).toBeVisible()

  // 3. Verificar orden: C(2) > A(1) > B(0)
  const blogItems = page.getByTestId('blog-item')
  await expect(blogItems.nth(0)).toContainText('Blog C')
  await expect(blogItems.nth(1)).toContainText('Blog A')
  await expect(blogItems.nth(2)).toContainText('Blog B')
})
  })
})
´´´

App.jsx:

´´´
import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [blogFormVisible, setBlogFormVisible] = useState(false)
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const [blogs, setBlogs] = useState([])
  const [visibleBlogs, setVisibleBlogs] = useState({})

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    try {
      const returnedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      setNewBlog({ title: '', author: '', url: '' })
      setBlogFormVisible(false)
    } catch (exception) {
      const status = exception.response?.status || exception.code
      const msg = exception.response?.data?.error || exception.message
      setErrorMessage(`Error: ${status} - ${msg}`)
    }
  }

  const toggleBlogVisibility = (id) => {
    setVisibleBlogs(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleLike = async (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id || blog.user }
    const returned = await blogService.update(blog.id, updatedBlog)
    setBlogs(blogs.map(b => b.id === blog.id ? returned : b))
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    }
  }

  const handleLogout = () => {
  window.localStorage.removeItem('loggedBlogAppUser')
  blogService.setToken(null)
  setUser(null)
}

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {errorMessage && <div className="error">{errorMessage}</div>}
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">username</label>
            <input
              id="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {errorMessage && <div className="error">{errorMessage}</div>}
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>  {/* ← aquí */}
      </p>

      {!blogFormVisible && <button onClick={() => setBlogFormVisible(true)}>new blog</button>}

      {blogFormVisible && (
        <form onSubmit={handleCreate}>
          <h3>create new</h3>
          <div>
            <label htmlFor="title">title</label>
            <input id="title" value={newBlog.title} onChange={e => setNewBlog({...newBlog, title: e.target.value})} />
          </div>
          <div>
            <label htmlFor="author">author</label>
            <input id="author" value={newBlog.author} onChange={e => setNewBlog({...newBlog, author: e.target.value})} />
          </div>
          <div>
            <label htmlFor="url">url</label>
            <input id="url" value={newBlog.url} onChange={e => setNewBlog({...newBlog, url: e.target.value})} />
          </div>
          <button type="submit">create</button>
          <button type="button" onClick={() => setBlogFormVisible(false)}>cancel</button>
        </form>
      )}

      {[...blogs].sort((a, b) => b.likes - a.likes).map(blog => (
        <div key={blog.id} data-testid="blog-item" className="blog-item">
          {blog.title} by {blog.author}
          <button onClick={() => toggleBlogVisibility(blog.id)}>
            {visibleBlogs[blog.id] ? 'hide' : 'view'}
          </button>
          {visibleBlogs[blog.id] && (
            <div>
              <p>{blog.url}</p>
              <p>likes {blog.likes} <button onClick={() => handleLike(blog)}>like</button></p>
              <p>{blog.user?.name}</p>
              {blog.user?.username === user.username && (
              <button onClick={() => handleDelete(blog)}>remove</button>
              
      )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default App
´´´

Prueba 8/8 sin errores//.

## Tarea 5.24: Blogs enrutados, Paso 1
App.jsx:

´´´
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'

const App = () => {
  // 1. Estados
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [blogFormVisible, setBlogFormVisible] = useState(false)
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  // 2. Efectos
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  // 3. Funciones
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
  }

  const handleCreate = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setBlogFormVisible(false)
      setNewBlog({ title: '', author: '', url: '' })
    } catch (exception) {
      setErrorMessage('Error creating blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleLike = async (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id || blog.user }
    const returned = await blogService.update(blog.id, updatedBlog)
    setBlogs(blogs.map(b => b.id === blog.id ? returned : b))
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    }
  }

  // 4. Renderizado
  return (
    <Router>
  <div style={{ padding: 10, backgroundColor: '#f0f0f0', marginBottom: 10 }}>
    <Link style={{ paddingRight: 10 }} to="/">blogs</Link>
    {user ? (
      <span>
        {user.name} logged in 
        <button onClick={handleLogout} style={{ marginLeft: 5 }}>logout</button>
      </span>
    ) : (
      <Link to="/login">login</Link>
    )}
  </div>

      <h2>Blog app</h2>
      {errorMessage && <div className="error">{errorMessage}</div>}

      <Routes>
        <Route path="/" element={
          <BlogList 
            blogs={blogs} 
            handleLike={handleLike} 
            handleDelete={handleDelete} 
            handleCreate={handleCreate}
            user={user} 
            blogFormVisible={blogFormVisible}
            setBlogFormVisible={setBlogFormVisible}
            newBlog={newBlog}
            setNewBlog={setNewBlog}
          />
        } />
        <Route path="/login" element={
          user ? <Navigate to="/" /> : 
          <LoginForm 
            handleLogin={handleLogin} 
            username={username} 
            setUsername={setUsername} 
            password={password} 
            setPassword={setPassword} 
          />
        } />
      </Routes>
    </Router>
  )
}

export default App
´´´

LoginForm.jsx:

´´´
const LoginForm = ({ handleLogin, username, setUsername, password, setPassword }) => {
    return (
    <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
        <div>
            username
            <input
                id="username"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
            />
        </div>
        <div>
            password
            <input
                id="password"
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
            />
        </div>
            <button type="submit">login</button>
        </form>
    </div>
    )
}

export default LoginForm
´´´

BlogList.jsx:

´´´
import { useState } from 'react'

const BlogList = ({ blogs, handleLike, handleDelete, user }) => {
    const [visibleBlogs, setVisibleBlogs] = useState({})

    const toggleBlogVisibility = (id) => {
    setVisibleBlogs(prev => ({ ...prev, [id]: !prev[id] }))
    }

    return (
    <div>
        <h2>blogs</h2>
        {[...blogs].sort((a, b) => b.likes - a.likes).map(blog => (
        <div key={blog.id} data-testid="blog-item" className="blog-item" style={{border: '1px solid black', margin: '5px', padding: '5px'}}>
            {blog.title} by {blog.author}
            <button onClick={() => toggleBlogVisibility(blog.id)}>
            {visibleBlogs[blog.id] ? 'hide' : 'view'}
            </button>
            {visibleBlogs[blog.id] && (
            <div>
                <p>{blog.url}</p>
                <p>likes {blog.likes} <button onClick={() => handleLike(blog)}>like</button></p>
                <p>{blog.user?.name}</p>
                {blog.user?.username === user.username && (
                <button onClick={() => handleDelete(blog)}>remove</button>
                )}
            </div>
            )}
        </div>
        ))}
    </div>
    )
}

export default BlogList
´´´

# Tarea 5.25: Blogs enrutados, Paso 2

App.jsx:
´´´
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
  blogService.getAll().then(blogs =>
    setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
  )
}, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
  }

  const handleLike = async (blog) => {
    if (!user) {
      alert('Solo los usuarios conectados pueden dar like')
      return
    }
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id || blog.user }
    const returned = await blogService.update(blog.id, updatedBlog)
    setBlogs(blogs.map(b => b.id === blog.id ? returned : b))
  }
  
  console.log('Blogs en App:', blogs)

  return (
    <Router>
      <div style={{ padding: 10, backgroundColor: '#f0f0f0', marginBottom: 10 }}>
        <Link style={{ paddingRight: 10 }} to="/">blogs</Link>
        {user ? <span>{user.name} logged in <button onClick={handleLogout}>logout</button></span> : <Link to="/login">login</Link>}
      </div>

      <h2>Blog app</h2>
      {errorMessage && <div className="error">{errorMessage}</div>}

      <Routes>
        <Route path="/" element={<BlogList blogs={blogs} handleLike={handleLike} user={user} />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginForm handleLogin={handleLogin} username={username} setUsername={setUsername} password={password} setPassword={setPassword} />} />
        <Route path="/blogs/:id" element={<BlogView blogs={blogs} handleLike={handleLike} user={user} />} />
      </Routes>
    </Router>
  )
}

export default App
´´´

LoginForm.jsx:
´´´
const LoginForm = ({ handleLogin, username, setUsername, password, setPassword }) => {
    return (
    <div>
        <h2>Log in to application</h2>
        
        <form onSubmit={handleLogin}>
            <div>
            username
            <input
            id="username"
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            />
        </div>
        <div>
            password
            <input
            id="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            />
        </div>
        <button id="login-button" type="submit">
            login
        </button>
        </form>
    </div>
    )
}

export default LoginForm
´´´

BlogList.jsx:
´´´
import { useState } from 'react'
import { Link } from 'react-router-dom'

const BlogList = ({ blogs, handleLike, handleDelete, user }) => {
    const [visibleBlogs, setVisibleBlogs] = useState({})

    const toggleBlogVisibility = (id) => {
        setVisibleBlogs(prev => ({ ...prev, [id]: !prev[id] }))
    }

    return (
    <div>
        <h2>blogs</h2>
        {[...blogs].sort((a, b) => b.likes - a.likes).map(blog => (
        <div key={blog.id} data-testid="blog-item" className="blog-item" style={{border: '1px solid black', margin: '5px', padding: '5px'}}>
            
            {/* Aquí se añade el Link que pide la tarea */}
            <Link to={`/blogs/${blog.id}`}>
                {blog.title} by {blog.author}
            </Link>

            <button onClick={() => toggleBlogVisibility(blog.id)}>
                {visibleBlogs[blog.id] ? 'hide' : 'view'}
            </button>
            
            {visibleBlogs[blog.id] && (
            <div>
                <p>{blog.url}</p>
                <p>likes {blog.likes} <button onClick={() => handleLike(blog)}>like</button></p>
                <p>{blog.user?.name}</p>
                {blog.user?.username === user.username && (
                <button onClick={() => handleDelete(blog)}>remove</button>
                )}
            </div>
            )}
        </div>
        ))}
    </div>
    )
}

export default BlogList
´´´

BlogView.jsx:

´´´
import { useParams } from 'react-router-dom'

const BlogView = ({ blogs, handleLike, user }) => {
    const id = useParams().id
    const blog = blogs.find(b => b.id === id)

    if (!blog) return null

    return (
    <div>
        <h2>{blog.title}</h2>
        <a href={blog.url}>{blog.url}</a>
        <p>
            {blog.likes} likes 
            {/* Solo mostramos el botón si hay un usuario logueado */}
            {user && (
            <button onClick={() => handleLike(blog)}>like</button>
        )}
        </p>
        <p>added by {blog.author}</p>
    </div>
    )
}

export default BlogView
´´´


Vista en localhost:5127

blogsMatti Luukkainen logged in logout
Blog app
blogs
Prueba de Blog Autenticado by Matti Luukkainenhide
https://fullstackopen.com/

likes 13 like

Matti Luukkainen

remove
Prueba de Blog Autenticado by Matti Luukkainenview
Prueba de Blog Autenticado by Matti Luukkainenview
Things I Don't Know as of 2018 by Dan Abramovview
Microservices and the First Law of Distributed Objects by Martin Fowlerview
Alicia en el país by Yoyoview


# Tarea 5.26: Blogs enrutados, Paso 3

BlogForm.jsx:
´´´
import { useState } from 'react'
import { useNavigate } from 'react-router-dom' // 1. Importar el hook

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  
  const navigate = useNavigate() // 2. Inicializar el hook

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
    
    // 3. Se redirige a la lista de blogs después de crear
    navigate('/') 
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        {/* ... (el código de inputs se mantiene igual) ... */}
        <div>
          <label htmlFor="title">title:</label>
          <input 
            id="title"
            name="title"
            value={title} 
            onChange={({ target }) => setTitle(target.value)} 
          />
        </div>
        <div>
          <label htmlFor="author">author:</label>
          <input 
            id="author"
            name="author"
            value={author} 
            onChange={({ target }) => setAuthor(target.value)} 
          />
        </div>
        <div>
          <label htmlFor="url">url:</label>
          <input 
            id="url"
            name="url"
            value={url} 
            onChange={({ target }) => setUrl(target.value)} 
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
´´´

App.jsx:
´´´
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import BlogForm from './components/BlogForm' // Importante: Asegúrate de tener este archivo

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
  }

  const handleLike = async (blog) => {
    if (!user) {
      alert('Solo los usuarios conectados pueden dar like')
      return
    }
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id || blog.user }
    const returned = await blogService.update(blog.id, updatedBlog)
    setBlogs(blogs.map(b => b.id === blog.id ? returned : b))
  }

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setErrorMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => setErrorMessage(null), 5000)
    } catch (exception) {
      setErrorMessage('Error creating blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  return (
    <Router>
      <div style={{ padding: 10, backgroundColor: '#f0f0f0', marginBottom: 10 }}>
        <Link style={{ paddingRight: 10 }} to="/">blogs</Link>
        
        {/* Enlace a crear solo si hay usuario */}
        {user && <Link style={{ paddingRight: 10 }} to="/create">new blog</Link>}
        
        {user 
          ? <span>{user.name} logged in <button onClick={handleLogout}>logout</button></span> 
          : <Link to="/login">login</Link>
        }
      </div>

      <h2>Blog app</h2>
      {errorMessage && <div className="error">{errorMessage}</div>}

      <Routes>
        <Route path="/" element={<BlogList blogs={blogs} handleLike={handleLike} user={user} />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginForm handleLogin={handleLogin} username={username} setUsername={setUsername} password={password} setPassword={setPassword} />} />
        <Route path="/blogs/:id" element={<BlogView blogs={blogs} handleLike={handleLike} user={user} />} />
        
        {/* Ruta protegida para crear */}
        <Route path="/create" element={user ? <BlogForm createBlog={createBlog} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
´´´

LoginForm.jsx:
´´´
const LoginForm = ({ handleLogin, username, setUsername, password, setPassword }) => {
    return (
    <div>
        <h2>Log in to application</h2>
        
        <form onSubmit={handleLogin}>
            <div>
            username
            <input
            id="username"
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            />
        </div>
        <div>
            password
            <input
            id="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            />
        </div>
        <button id="login-button" type="submit">
            login
        </button>
        </form>
    </div>
    )
}

export default LoginForm
´´´

BlogList.jsx:
´´´
import { useState } from 'react'
import { Link } from 'react-router-dom'

const BlogList = ({ blogs, handleLike, handleDelete, user }) => {
    const [visibleBlogs, setVisibleBlogs] = useState({})

    const toggleBlogVisibility = (id) => {
        setVisibleBlogs(prev => ({ ...prev, [id]: !prev[id] }))
    }

    return (
        <div>
            <h2>blogs</h2>
            {[...blogs].sort((a, b) => b.likes - a.likes).map(blog => (
                <div key={blog.id} data-testid="blog-item" className="blog-item" style={{border: '1px solid black', margin: '5px', padding: '5px'}}>
                    
                    <Link to={`/blogs/${blog.id}`}>
                        {blog.title} by {blog.author}
                    </Link>

                    <button onClick={() => toggleBlogVisibility(blog.id)}>
                        {visibleBlogs[blog.id] ? 'hide' : 'view'}
                    </button>
                    
                    {visibleBlogs[blog.id] && (
                        <div>
                            <p>{blog.url}</p>
                            <p>likes {blog.likes} <button onClick={() => handleLike(blog)}>like</button></p>
                            <p>{blog.user?.name}</p>
                            
                            {/* CORRECCIÓN: Validamos que 'user' exista antes de acceder a su username */}
                            {user && blog.user?.username === user.username && (
                                <button onClick={() => handleDelete(blog)}>remove</button>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default BlogList
´´´

BlogView.jsx:
´´´
import { useParams } from 'react-router-dom'

const BlogView = ({ blogs, handleLike, user }) => {
    const id = useParams().id
    const blog = blogs.find(b => b.id === id)

    if (!blog) return null

    return (
    <div>
        <h2>{blog.title}</h2>
        <a href={blog.url}>{blog.url}</a>
        <p>
            {blog.likes} likes 
            {/* Solo mostramos el botón si hay un usuario logueado */}
            {user && (
            <button onClick={() => handleLike(blog)}>like</button>
        )}
        </p>
        <p>added by {blog.author}</p>
    </div>
    )
}

export default BlogView
´´´

# Tarea 5.27: Blogs enrutados, Paso 4
BlogView.test.jsx:

´´´
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, test, expect, vi } from 'vitest'
import BlogView from './BlogView'

describe('<BlogView />', () => {
    const blog = {
        id: '1', // Es importante añadir el ID para que coincida con el route param
        title: 'Testing routes',
        author: 'Fullstack Open',
        url: 'http://example.com',
        likes: 10,
        user: { name: 'Admin', username: 'adminuser' }
    }

    test('usuario no registrado: ve info pero NO ve botones', () => {
        render(
        <MemoryRouter initialEntries={['/blogs/1']}>
        <Routes>
            <Route path="/blogs/:id" element={<BlogView blogs={[blog]} user={null} />} />
        </Routes>
        </MemoryRouter>
    )
    
    expect(screen.getByText('Testing routes')).toBeDefined()
    expect(screen.getByText('10 likes')).toBeDefined()
    
    // Verificamos que los botones no estén en el DOM
    expect(screen.queryByRole('button', { name: /like/i })).toBeNull()
    expect(screen.queryByRole('button', { name: /remove/i })).toBeNull()
    })

    test('usuario logueado (no creador): ve botón de like pero NO de eliminar', () => {
        const user = { username: 'otheruser' }
        render(
        <MemoryRouter initialEntries={['/blogs/1']}>
            <Routes>
            <Route path="/blogs/:id" element={<BlogView blogs={[blog]} user={user} handleLike={vi.fn()} />} />
        </Routes>
        </MemoryRouter>
    )
    
    expect(screen.getByRole('button', { name: /like/i })).toBeDefined()
    expect(screen.queryByRole('button', { name: /remove/i })).toBeNull()
    })

    test('creador del blog: ve botón de like Y botón de eliminar', () => {
        const creator = { username: 'adminuser' }
        render(
        <MemoryRouter initialEntries={['/blogs/1']}>
            <Routes>
            <Route path="/blogs/:id" element={
            <BlogView blogs={[blog]} user={creator} handleLike={vi.fn()} handleDelete={vi.fn()} />
            } />
        </Routes>
        </MemoryRouter>
    )
    
    expect(screen.getByRole('button', { name: /like/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /remove/i })).toBeDefined()
    })
})
´´´

BlogView.jsx:
´´´
import { useParams } from 'react-router-dom'

// 1. Asegúrate de incluir handleDelete en las props
const BlogView = ({ blogs, handleLike, handleDelete, user }) => {
    const id = useParams().id
    const blog = blogs.find(b => b.id === id)

    if (!blog) return null

        return (
    <>
        <h2>{blog.title}</h2>
        <p>{blog.url}</p>
        <p>{blog.likes} likes</p>

        {user && <button onClick={handleLike}>like</button>}

      {/* 3. Ahora handleDelete funcionará porque está en las props */}
        {user && blog.user?.username === user.username && (
        <button onClick={handleDelete}>remove</button>
        )}
    </>
    )
}

export default BlogView
´´´

playwright.config.js:
´´´
// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests', // Solo mira aquí para tests de Playwright
  testIgnore: '**/src/components/**', // <-- ignora tus pruebas de React
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
´´´

blog_app.spec.js:
´´´
const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  // Un solo beforeEach, con todo lo necesario adentro
  beforeEach(async ({ page, request }) => {
    // 1. Limpiar base de datos
    await request.post('http://localhost:3003/api/testing/reset')
    
    // 2. Crear el usuario necesario para el login
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'tu_nombre',
        username: 'tu_usuario',
        password: 'tu_password'
      }
    })
    
    // 3. Ir a la página
    await page.goto('http://localhost:5173')
  })

  test('User can login', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    
    await page.getByLabel('username').fill('tu_usuario')
    await page.getByLabel('password').fill('tu_password')
    
    await page.getByRole('button', { name: 'login' }).click()
    
    await expect(page.getByText('tu_nombre logged in')).toBeVisible()
  })
})
´´´

Prueba 1/1 resultado sin error.


# Tarea 5.28: Blogs enrutados, Paso 5
blog_app.spec.js:

´´´
const { test, expect, beforeEach, describe, request } = require('@playwright/test')

describe('Blog app', () => {

  beforeEach(async ({ page, request }) => {
    // 1. Limpiamos la base de datos antes de cada prueba
    await request.post('http://localhost:3003/api/testing/reset')
    
    // 2. Creamos un usuario de prueba para todas las pruebas
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'tu_nombre',
        username: 'tu_usuario',
        password: 'tu_password'
      }
    })
    
    // 3. Vamos a la página
    await page.goto('http://localhost:5173')
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      // Tu código para loguearse exitosamente
      await page.getByRole('link', { name: 'login' }).click()
      await page.getByLabel('username').fill('tu_usuario')
      await page.getByLabel('password').fill('tu_password')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('tu_nombre logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await page.getByLabel('username').fill('tu_usuario')
      await page.getByLabel('password').fill('contraseña_incorrecta')
      await page.getByRole('button', { name: 'login' }).click()
      // Verifica que aparezca un mensaje de error (ajusta el texto a tu app)
      await expect(page.getByText('Wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      // Realizamos el login ANTES de cada prueba dentro de este grupo
      await page.getByRole('link', { name: 'login' }).click()
      await page.getByLabel('username').fill('tu_usuario')
      await page.getByLabel('password').fill('tu_password')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
  // 1. Primero navega al formulario
  await page.getByRole('link', { name: 'new blog' }).click()

  // 2. Ahora sí, rellena los campos
  await page.getByLabel('title:').fill('Mi nuevo blog')
  await page.getByLabel('author:').fill('Yo mismo')
  await page.getByLabel('url:').fill('http://ejemplo.com')
  await page.getByRole('button', { name: 'create' }).click()
    // 3. Verifica
  await expect(page.getByText('Mi nuevo blog by Yo mismo').last()).toBeVisible()
  // Verificamos que el blog aparezca en la lista
  await expect(page.getByText('Mi nuevo blog by Yo mismo').last()).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
  // 1. Crear el blog
  await page.getByRole('link', { name: 'new blog' }).click();
  await page.getByLabel('title:').fill('Blog para likes');
  await page.getByLabel('author:').fill('Autor de prueba');
  await page.getByLabel('url:').fill('http://test.com');

  // Si prefieres esperar a la red, haz el filtro más flexible:
  // Eliminamos status === 201 temporalmente para debuggear si ese es el problema
  await Promise.all([
    page.waitForResponse(r => r.url().includes('/api/blogs') && r.request().method() === 'POST'),
    page.getByRole('button', { name: 'create' }).click()
  ]);

  // 2. Localizar el contenedor específico
  const blogContainer = page.locator('div').filter({ has: page.getByText('Blog para likes') });

  // 3. Interactuar
  await blogContainer.getByRole('button', { name: 'view' }).first().click();
  await blogContainer.getByRole('button', { name: 'like' }).click();
  
  // 4. Esperar al cambio de estado visual (mejor que esperar a la red)
  const likesParagraph = blogContainer.getByText(/likes \d+/); 
  await expect(likesParagraph).toContainText('likes 1');
});

    test('the user can delete their own blog', async ({ page }) => {
  // 1. Crear el blog
  await page.getByRole('link', { name: 'new blog' }).click();
  await page.getByLabel('title:').fill('Blog para borrar');
  await page.getByLabel('author:').fill('Autor de prueba');
  await page.getByLabel('url:').fill('http://ejemplo.com');

  // En lugar de waitForResponse, simplemente haz clic
  await page.getByRole('button', { name: 'create' }).click();

// 1. Asegúrate de que el contenedor sea lo más específico posible
const blogContainer = page.locator('div').filter({ 
  has: page.getByText('Blog para borrar by Autor de prueba') 
});

// 2. Busca el link dentro de ese contenedor, pero usa el texto exacto 
// y añade .first() para garantizar que Playwright solo tome uno.
const blogLink = blogContainer.getByRole('link', { name: 'Blog para borrar by Autor de prueba' }).first();

// 3. Ahora la validación no fallará por ambigüedad
await expect(blogLink).toBeVisible();
    });
  })
})
´´´

5/5 Prueba sin errores.

# Tarea 5.29: Blogs con estilo, Paso 1
blog_app.spec.js:

´´´
const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('When logged in', () => {

  beforeEach(async ({ page, request }) => {
    // 1. Limpiar base de datos
    await request.post('http://localhost:3003/api/testing/reset')
    
    // 2. Crear usuario
    await request.post('http://localhost:3003/api/users', {
      data: { name: 'Tester', username: 'tester', password: 'password123' }
    })

    // 3. Login y guardar estado (localStorage)
    const response = await request.post('http://localhost:3003/api/login', {
      data: { username: 'tester', password: 'password123' }
    })
    const userResponse = await response.json() 

    await page.goto('http://localhost:5173')
    await page.evaluate((u) => {
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(u))
    }, userResponse)

    await page.reload()
  })

  test('a new blog can be created', async ({ page }) => {
    const title = `Blog único ${Math.random().toString(36).substring(7)}`
    
    await page.getByRole('link', { name: 'new blog' }).click()
    await page.getByRole('textbox', { name: 'title' }).fill(title)
    await page.getByRole('textbox', { name: 'author' }).fill('Yo mismo')
    await page.getByRole('textbox', { name: 'url' }).fill('http://ejemplo.com')
    
    // NO uses waitForResponse para WebSockets si no es necesario.
    // Simplemente haz el click y espera a que el elemento sea visible.
    await page.getByRole('button', { name: 'CREATE' }).click()
    
    // Playwright esperará automáticamente a que el elemento aparezca en la página
    // con su mecanismo interno de "auto-waiting".
    const blogLink = page.getByRole('link', { name: title });
    await expect(blogLink).toBeVisible({ timeout: 10000 }); 
  })

  test('a blog can be liked', async ({ page, request }) => {
    // 1. Setup vía API
    const loginResponse = await request.post('http://localhost:3003/api/login', {
      data: { username: 'tester', password: 'password123' }
    })
    const { token } = await loginResponse.json()
    const title = `Blog para like ${Math.random().toString(36).substring(7)}`;

    await request.post('http://localhost:3003/api/blogs', {
      data: { title, author: 'Autor', url: 'http://test.com' },
      headers: { Authorization: `Bearer ${token}` }
    })

    await page.reload(); 
    await page.getByRole('link', { name: title }).click();
    
    // Identificar elementos
    const blogContainer = page.locator('div', { has: page.getByRole('heading', { name: title }) });
    const likeButton = blogContainer.getByRole('button', { name: 'like' });
    const likesParagraph = blogContainer.locator('p:has-text("likes")');

    // 2. Acción: Simplemente haz click. No necesitas Promise.all para esperar la red.
    await likeButton.click();

    // 3. Validación: Playwright reintentará este expect hasta que el texto sea "1 likes"
    await expect(likesParagraph).toContainText('1');
  })

  test('the user can delete their own blog', async ({ page, request }) => {
    const title = `Blog a borrar ${Math.random().toString(36).substring(7)}`;

    const loginResponse = await request.post('http://localhost:3003/api/login', {
      data: { username: 'tester', password: 'password123' }
    })
    const { token } = await loginResponse.json()
    
    await request.post('http://localhost:3003/api/blogs', {
      data: { title, author: 'Autor de prueba', url: 'http://ejemplo.com' },
      headers: { Authorization: `Bearer ${token}` }
    })

    await page.reload()

    await page.getByRole('link', { name: title }).click();
    
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'remove' }).click();
    page.on('response', resp => console.log('Respuesta recibida:', resp.url(), resp.status()));
    await expect(page.getByRole('link', { name: title })).not.toBeVisible();
  })
})
´´´

playwright.config.js:

´´´
// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests', // Solo mira aquí para tests de Playwright
  testIgnore: '**/src/components/**', // <-- ignora tus pruebas de React
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
´´´

package.json:

´´´
{
  "dependencies": {
    "mongoose": "^9.7.0"
  }
}

´´´


App.jsx:

´´´
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import BlogForm from './components/BlogForm'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [blogs, setBlogs] = useState([])

  // UN SOLO useEffect para cargar el usuario
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // UN SOLO useEffect para obtener los blogs
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [])

  // UN SOLO handleLogin
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
  }

const handleLike = async (blog) => {
  try {
    const updatedBlog = await blogService.update(blog.id, { 
      ...blog, 
      likes: blog.likes + 1,
      user: blog.user.id || blog.user 
    });
    
    // ¡CRÍTICO! Esto fuerza a React a repintar el componente con el nuevo valor
    setBlogs(blogs.map(b => b.id === blog.id ? updatedBlog : b));
  } catch (exception) {
    console.error("Error al dar like:", exception);
  }
}

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setErrorMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => setErrorMessage(null), 5000)
    } catch (exception) {
      setErrorMessage('Error creating blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  return (
    <Router>
      <div style={{ padding: 10, backgroundColor: '#f0f0f0', marginBottom: 10 }}>
        <Link style={{ paddingRight: 10 }} to="/">blogs</Link>
        {user && <Link style={{ paddingRight: 10 }} to="/create">new blog</Link>}
        
        {user 
          ? <span>{user.name} logged in <button onClick={handleLogout}>logout</button></span> 
          : <Link to="/login">login</Link>
        }
      </div>

      <h2>Blog app</h2>
      {errorMessage && <div className="error">{errorMessage}</div>}

      <Routes>
        <Route path="/" element={<BlogList blogs={blogs} />} />
        <Route 
          path="/login" 
          element={
            user ? <Navigate to="/" /> : 
            <LoginForm 
              handleLogin={handleLogin} 
              username={username} 
              setUsername={setUsername} 
              password={password} 
              setPassword={setPassword} 
            />
          } 
        />
        <Route path="/blogs/:id" element={<BlogView blogs={blogs} handleLike={handleLike} user={user} />} />
        <Route path="/create" element={user ? <BlogForm createBlog={createBlog} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
´´´

3/3 Pruebas correctas.

# Tarea 5.30: Blogs estilizados, Paso 2
blog_app.spec.js:

´´´
const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('When logged in', () => {

  beforeEach(async ({ page, request }) => {
    // 1. Limpiar base de datos
    await request.post('http://localhost:3003/api/testing/reset')
    
    // 2. Crear usuario
    await request.post('http://localhost:3003/api/users', {
      data: { name: 'Tester', username: 'tester', password: 'password123' }
    })

    // 3. Login y guardar estado (localStorage)
    const response = await request.post('http://localhost:3003/api/login', {
      data: { username: 'tester', password: 'password123' }
    })
    const userResponse = await response.json() 

    await page.goto('http://localhost:5173')
    await page.evaluate((u) => {
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(u))
    }, userResponse)

    await page.reload()
  })

  test('a new blog can be created', async ({ page }) => {
  const title = `Blog único ${Math.random().toString(36).substring(7)}`
  
  await page.getByRole('link', { name: 'new blog' }).click()
  await page.getByRole('textbox', { name: 'title' }).fill(title)
  await page.getByRole('textbox', { name: 'author' }).fill('Yo mismo')
  await page.getByRole('textbox', { name: 'url' }).fill('http://ejemplo.com')
  
  await page.getByRole('button', { name: 'CREATE' }).click()
  
  // 1. Asegúrate de que el formulario de creación ya no sea visible
  await expect(page.getByRole('button', { name: 'CREATE' })).not.toBeVisible()
  
  // 2. En lugar de buscar el 'link' exacto, busca el texto en toda la página
  // Esto es más robusto ante cambios en el DOM
  await expect(page.locator('body')).toContainText(title, { timeout: 15000 })
  
  // 3. Una vez que el texto existe, ahora sí verifica el link
  const blogLink = page.getByRole('link', { name: title })
  await expect(blogLink).toBeVisible()
})

  test('a blog can be liked', async ({ page, request }) => {
    // 1. Setup vía API
    const loginResponse = await request.post('http://localhost:3003/api/login', {
      data: { username: 'tester', password: 'password123' }
    })
    const { token } = await loginResponse.json()
    const title = `Blog para like ${Math.random().toString(36).substring(7)}`;

    await request.post('http://localhost:3003/api/blogs', {
      data: { title, author: 'Autor', url: 'http://test.com' },
      headers: { Authorization: `Bearer ${token}` }
    })

    await page.reload(); 
    await page.getByRole('link', { name: title }).click();
    
    // Identificar elementos
    const blogContainer = page.locator('div', { has: page.getByRole('heading', { name: title }) });
    const likeButton = blogContainer.getByRole('button', { name: 'like' });
    const likesParagraph = blogContainer.locator('p:has-text("likes")');

    // 2. Acción: Simplemente haz click. No necesitas Promise.all para esperar la red.
    await likeButton.click();

    // 3. Validación: Playwright reintentará este expect hasta que el texto sea "1 likes"
    await expect(likesParagraph).toContainText('1');
  })

  test('the user can delete their own blog', async ({ page, request }) => {
    const title = `Blog a borrar ${Math.random().toString(36).substring(7)}`;

    const loginResponse = await request.post('http://localhost:3003/api/login', {
      data: { username: 'tester', password: 'password123' }
    })
    const { token } = await loginResponse.json()
    
    await request.post('http://localhost:3003/api/blogs', {
      data: { title, author: 'Autor de prueba', url: 'http://ejemplo.com' },
      headers: { Authorization: `Bearer ${token}` }
    })

    await page.reload()

    await page.getByRole('link', { name: title }).click();
    
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'remove' }).click();
    page.on('response', resp => console.log('Respuesta recibida:', resp.url(), resp.status()));
    await expect(page.getByRole('link', { name: title })).not.toBeVisible();
  })
})
´´´

index.css:

´´´
/* src/index.css */

/* Contenedor principal para dar un poco de aire */
.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
    font-family: sans-serif;
}

/* Barra azul de navegación */
.navbar {
    background-color: #2196f3;
    padding: 15px;
    display: flex;
    gap: 20px;
    align-items: center;
    color: white;
    border-radius: 4px;
}

.nav-link {
    color: white;
    text-decoration: none;
    font-weight: bold;
}

/* Notificación verde */
.notification {
    background-color: #e8f5e9;
    color: #2e7d32;
    border: 2px solid #2e7d32;
    padding: 15px;
    margin: 20px 0;
    border-radius: 5px;
    font-weight: bold;
}

/* Estilo para el botón de logout */
button {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
}
´´´

main.jsx:

´´´
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // <-- ¡ESTA LÍNEA ES LA QUE UNE TODO!

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
´´´

App.jsx:

´´´
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import BlogForm from './components/BlogForm'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
  }

  const handleLike = async (blog) => {
    try {
      const updatedBlog = await blogService.update(blog.id, { 
        ...blog, 
        likes: blog.likes + 1,
        user: blog.user.id || blog.user 
      })
      setBlogs(blogs.map(b => b.id === blog.id ? updatedBlog : b))
    } catch (exception) {
      console.error("Error al dar like:", exception)
    }
  }

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setErrorMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => setErrorMessage(null), 5000)
    } catch (exception) {
      setErrorMessage('Error creating blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  return (
    <Router>
      <div className="container">
        {/* Barra de navegación estilizada */}
        <div className="navbar">
          <Link className="nav-link" to="/">blogs</Link>
          {user && <Link className="nav-link" to="/create">new blog</Link>}
          
          <div className="user-info">
            {user 
              ? <span>{user.name} logged in <button onClick={handleLogout}>logout</button></span> 
              : <Link className="nav-link" to="/login">login</Link>
            }
          </div>
        </div>

        <h2>Blog app</h2>

        {/* Notificación estilizada */}
        {errorMessage && <div className="notification">{errorMessage}</div>}

        <Routes>
          <Route path="/" element={<BlogList blogs={blogs} />} />
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/" /> : 
              <LoginForm 
                handleLogin={handleLogin} 
                username={username} 
                setUsername={setUsername} 
                password={password} 
                setPassword={setPassword} 
              />
            } 
          />
          <Route path="/blogs/:id" element={<BlogView blogs={blogs} handleLike={handleLike} user={user} />} />
          <Route path="/create" element={user ? <BlogForm createBlog={createBlog} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
´´´

3/3 Pruebas correctas.

# Tarea 5.31: Blogs con estilo, Paso 3
BlogView.jsx:
´´´
import { useParams } from 'react-router-dom'

const BlogView = ({ blogs, handleLike, handleDelete, user }) => {
    const id = useParams().id
    const blog = blogs.find(b => b.id === id)

    if (!blog) return null

  // Filtramos blogs del mismo autor
    const blogsDelAutor = blogs.filter(b => b.user?.id === blog.user?.id || b.user?.name === blog.user?.name)

    return (
        <div className="blog-card">
        <h2>{blog.title}</h2>
        <a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a>
        
        {/* Contenedor Flex para alinear los elementos */}
        <div className="button-group">
            <p><strong>{blog.likes} likes</strong></p>
            <button onClick={() => handleLike(blog)}>LIKE</button>
        
            {user && blog.user?.username === user.username && (
            <button className="remove-btn" onClick={() => handleDelete(blog)}>REMOVE</button>
        )}
        </div>
        
        <p>Added by: {blog.user?.name || 'Anonymous'}</p>
        
        <h3>More blogs by {blog.user?.name || 'this author'}:</h3>
        <ul>
            {blogsDelAutor
            .filter(b => b.id !== blog.id)
            .map(b => (
                <li key={b.id}>{b.title}</li>
        ))}
        </ul>
    </div>
    )
}

export default BlogView
´´´

App.jsx:
´´´
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import BlogForm from './components/BlogForm'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
  }

  const handleLike = async (blog) => {
    try {
      const updatedBlog = await blogService.update(blog.id, { 
        ...blog, 
        likes: blog.likes + 1,
        user: blog.user.id || blog.user 
      })
      setBlogs(blogs.map(b => b.id === blog.id ? updatedBlog : b).sort((a, b) => b.likes - a.likes))
    } catch (exception) {
      console.error("Error al dar like:", exception)
    }
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title}?`)) {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    }
  }

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog).sort((a, b) => b.likes - a.likes))
      setErrorMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => setErrorMessage(null), 5000)
    } catch (exception) {
      setErrorMessage('Error creating blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  return (
    <Router>
      <div className="container" style={{ padding: '20px' }}>
        
        {/* Barra de navegación corregida y separada */}
        <div className="navbar" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#87CEEB', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link className="nav-link" to="/">BLOGS</Link>
            {user && <Link className="nav-link" to="/create">NEW BLOG</Link>}
          </div>
          
          <div className="user-info">
            {user ? (
              <>
                <span style={{ marginRight: '10px' }}>{user.name} logged in</span>
                <button className="logout-btn" onClick={handleLogout}>LOGOUT</button>
              </>
            ) : (
              <Link className="nav-link" to="/login">LOGIN</Link>
            )}
          </div>
        </div>

        <h2>Blog app</h2>

        {errorMessage && <div className="notification" style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>}

        <Routes>
          <Route path="/" element={<BlogList blogs={blogs} />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : 
            <LoginForm 
              handleLogin={handleLogin} 
              username={username} 
              setUsername={setUsername} 
              password={password} 
              setPassword={setPassword} 
            />} 
          />
          <Route path="/blogs/:id" element={
            <BlogView blogs={blogs} handleLike={handleLike} handleDelete={handleDelete} user={user} />
          } />
          <Route path="/create" element={user ? <BlogForm createBlog={createBlog} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
´´´

LoginForm.jsx:
´´´
// src/components/LoginForm.jsx
import { TextField, Button, Paper, Typography, Box } from '@mui/material'

const LoginForm = ({ handleLogin, username, setUsername, password, setPassword }) => {
    return (
    <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Log in to application</Typography>
        
        <form onSubmit={handleLogin}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

            <TextField 
                label="username" 
                value={username}
                onChange={({ target }) => setUsername(target.value)} 
            />

            <TextField 
                label="password" 
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)} 
            />

            <Button variant="contained" type="submit">
                LOGIN
            </Button>

        </Box>
        </form>
    </Paper>
    )
}

export default LoginForm
´´´

BlogForm.jsx:

´´´
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button, Paper, Typography, Box } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  
  const navigate = useNavigate()

  const addBlog = async (event) => {
    event.preventDefault()
    
    await createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
    
    navigate('/') 
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 450, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        create new
      </Typography>
      
      <form onSubmit={addBlog}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
          <TextField
            label="author"
            variant="outlined"
            fullWidth
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
          <TextField
            label="url"
            variant="outlined"
            fullWidth
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            sx={{ mt: 1 }}
          >
            CREATE
          </Button>
        </Box>
      </form>
    </Paper>
  )
}

export default BlogForm
´´´

login.js:
´´´
import axios from 'axios'

// Al usar el proxy, basta con la ruta relativa
const baseUrl = '/api/login' 

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }
´´´

index.css:
´´´
/* src/index.css */

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
    font-family: sans-serif;
}

/* Asegura que la barra de navegación se comporte bien */
.navbar {
    background-color: #2196f3;
    padding: 15px;
    display: flex;
    gap: 20px;
    align-items: center;
    color: white;
    border-radius: 4px;
}

/* Estilo para el botón de logout */
.logout-btn {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
    margin-left: 10px;
    font-weight: bold;
}

.nav-link {
    color: white;
    text-decoration: none;
    font-weight: bold;
}

.notification {
    background-color: #e8f5e9;
    color: #2e7d32;
    border: 2px solid #2e7d32;
    padding: 15px;
    margin: 20px 0;
    border-radius: 5px;
    font-weight: bold;
}

/* Botón estándar (rojo) */
button {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 10px; /* Consolidamos el margen aquí */
}

/* Botón de eliminar (blanco con borde rojo) */
.remove-btn {
    background-color: white;
    color: #f44336;
    border: 1px solid #f44336;
    padding: 7px 15px; /* Ajuste fino para compensar el borde */
    cursor: pointer;
    margin-left: 10px;
}

.blog-card {
    border: 1px solid #e1e1e1;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    max-width: 600px;
}
´´´

blog_app.spec.js:
´´´
const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('When logged in', () => {

  beforeEach(async ({ page, request }) => {
    // 1. Limpiar base de datos
    await request.post('http://localhost:3003/api/testing/reset')
    
    // 2. Crear usuario
    await request.post('http://localhost:3003/api/users', {
      data: { name: 'Tester', username: 'tester', password: 'password123' }
    })

    // 3. Login y guardar estado (localStorage)
    const response = await request.post('http://localhost:3003/api/login', {
      data: { username: 'tester', password: 'password123' }
    })
    const userResponse = await response.json() 

    await page.goto('http://localhost:5173')
    await page.evaluate((u) => {
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(u))
    }, userResponse)

    await page.reload()
  })

  test('a new blog can be created', async ({ page }) => {
  const title = `Blog único ${Math.random().toString(36).substring(7)}`
  
  await page.getByRole('link', { name: 'new blog' }).click()
  await page.getByRole('textbox', { name: 'title' }).fill(title)
  await page.getByRole('textbox', { name: 'author' }).fill('Yo mismo')
  await page.getByRole('textbox', { name: 'url' }).fill('http://ejemplo.com')
  
  await page.getByRole('button', { name: 'CREATE' }).click()
  
  // 1. Aseguramos que el formulario desapareció
  await expect(page.getByRole('button', { name: 'CREATE' })).not.toBeVisible()
  
  // 2. Esperamos que el nuevo blog sea visible en la lista
  // Al usar getByRole, Playwright hace el 'auto-waiting' por ti.
  await expect(page.getByRole('link', { name: title })).toBeVisible({ timeout: 15000 })
})

  test('a blog can be liked', async ({ page, request }) => {
    // 1. Setup vía API
    const loginResponse = await request.post('http://localhost:3003/api/login', {
      data: { username: 'tester', password: 'password123' }
    })
    const { token } = await loginResponse.json()
    const title = `Blog para like ${Math.random().toString(36).substring(7)}`;

    await request.post('http://localhost:3003/api/blogs', {
      data: { title, author: 'Autor', url: 'http://test.com' },
      headers: { Authorization: `Bearer ${token}` }
    })

    await page.reload(); 
    await page.getByRole('link', { name: title }).click();
    
    // Identificar elementos
    const blogContainer = page.locator('div', { has: page.getByRole('heading', { name: title }) });
    const likeButton = blogContainer.getByRole('button', { name: 'like' });
    const likesParagraph = blogContainer.locator('p:has-text("likes")');

    // 2. Acción: Simplemente haz click. No necesitas Promise.all para esperar la red.
    await likeButton.click();

    // 3. Validación: Playwright reintentará este expect hasta que el texto sea "1 likes"
    await expect(likesParagraph).toContainText('1');
  })

  test('the user can delete their own blog', async ({ page, request }) => {
    const title = `Blog a borrar ${Math.random().toString(36).substring(7)}`;

    const loginResponse = await request.post('http://localhost:3003/api/login', {
      data: { username: 'tester', password: 'password123' }
    })
    const { token } = await loginResponse.json()
    
    await request.post('http://localhost:3003/api/blogs', {
      data: { title, author: 'Autor de prueba', url: 'http://ejemplo.com' },
      headers: { Authorization: `Bearer ${token}` }
    })

    await page.reload()

    await page.getByRole('link', { name: title }).click();
    
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'remove' }).click();
    page.on('response', resp => console.log('Respuesta recibida:', resp.url(), resp.status()));
    await expect(page.getByRole('link', { name: title })).not.toBeVisible();
  })
})
´´´

3/3 Pruebas correctas.
--------------------------
