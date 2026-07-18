import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAnecdotes } from './hooks'

import AnecdoteList from './components/AnecdoteList'
import About from './components/About'
import Menu from './components/Menu'
import Footer from './components/Footer'
import CreateNew from './components/CreateNew'

import NotFound from './components/NotFound'

const App = () => {
  const { anecdotes, addAnecdote } = useAnecdotes()

  return (
    <ErrorBoundary>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/anecdotes" element={<AnecdoteList />} />
    
    {/* Esta es la ruta que captura todo lo que no coincide arriba */}
    <Route path="*" element={<NotFound />} />
  </Routes>
</ErrorBoundary>
  )
}

export default App