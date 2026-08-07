import { useAnecdoteQueries } from './hooks/useAnecdoteHooks'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

const App = () => {
  const { result, voteMutation } = useAnecdoteQueries()

  if (result.isPending) return <div>loading data...</div>
  if (result.isError) return <div>anecdote service not available</div>

  const anecdotes = result.data
  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <AnecdoteForm />
      {sortedAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => voteMutation.mutate(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App