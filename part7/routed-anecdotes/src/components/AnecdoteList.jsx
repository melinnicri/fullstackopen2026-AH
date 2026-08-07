import { useAnecdotes } from '../hooks'

const AnecdoteList = () => {
  const { anecdotes, deleteAnecdote } = useAnecdotes()

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          {anecdote.content}
          <button onClick={() => deleteAnecdote(anecdote.id)}>borrar</button>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList