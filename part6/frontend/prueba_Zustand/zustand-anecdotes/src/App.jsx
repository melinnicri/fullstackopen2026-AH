import { useEffect } from 'react'
import { useAnecdoteActions, useAnecdotes } from './store'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'
import Filter from './components/Filter'

const App = () => {
  const { initialize } = useAnecdoteActions()
  const anecdotes = useAnecdotes()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    console.log('Anécdotas cargadas en el store:', anecdotes)
  }, [anecdotes])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdoteList />
      <AnecdoteForm /> 
    </div>
  )
}

export default App