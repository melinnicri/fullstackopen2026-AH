import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotify } from '../NotificationContext' // Solo necesitas este, ya que encapsula el dispatch

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const notify = useNotify() // Usamos el hook personalizado

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notify(`anecdote '${newAnecdote.content}' created`)
    },
    onError: () => {
      notify('too short anecdote, must have length 5 or more')
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    
    // Validación previa para feedback instantáneo
    if (content.length < 5) {
      notify('too short anecdote, must have length 5 or more')
      return
    }

    event.target.reset()
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm