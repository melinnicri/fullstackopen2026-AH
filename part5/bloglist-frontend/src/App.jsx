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