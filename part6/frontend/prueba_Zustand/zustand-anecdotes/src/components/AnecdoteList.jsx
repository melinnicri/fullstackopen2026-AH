import { useVisibleAnecdotes, useAnecdoteActions } from '../store'
import { useNotificationActions } from '../notificationStore'

const AnecdoteList = () => {
  const anecdotes = useVisibleAnecdotes()
  console.log('Anecdotas filtradas recibidas por el componente:', anecdotes)
  const { vote, remove } = useAnecdoteActions()
  const setNotification = useNotificationActions()

  const handleDelete = (anecdote) => {
    if (window.confirm(`Delete '${anecdote.content}'?`)) {
      remove(anecdote.id)
      setNotification(`Deleted '${anecdote.content}'`, 5)
    }
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
            <button onClick={() => handleDelete(anecdote)}>delete</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList