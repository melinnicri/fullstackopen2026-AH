import { useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import UserList from './components/UserList'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList' 
import BlogForm from './components/BlogForm'
import UserView from './components/UserView'
import BlogView from './components/BlogView'
import { UserContext } from './context/UserProvider'

function App() {
  const { user, logout } = useContext(UserContext)

  if (!user) {
    return <LoginForm />
  }

  return (
    <Router>
      <nav style={{ 
        backgroundColor: '#1976d2', 
        padding: '15px', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <strong style={{ fontSize: '1.2rem' }}>Blog App</strong>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Blogs</Link>
          <Link to="/users" style={{ color: 'white', textDecoration: 'none' }}>Users</Link>
          <Link to="/create" style={{ color: 'white', textDecoration: 'none' }}>New Blog</Link>
        </div>
        <div>
          <span>{user.name} logged in</span>
          <button onClick={logout} style={{ marginLeft: '10px' }}>Logout</button>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/create" element={<BlogForm />} />
        <Route path="/users/:id" element={<UserView />} /> 
        <Route path="/blogs/:id" element={<BlogView />} />
      </Routes>
    </Router>
  )
}

export default App