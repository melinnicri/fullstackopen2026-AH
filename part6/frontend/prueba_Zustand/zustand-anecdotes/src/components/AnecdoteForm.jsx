import { useAnecdoteActions } from '../store'
import { useNotificationActions } from '../notificationStore'

const AnecdoteForm = () => {
    const { create } = useAnecdoteActions()
    const setNotification = useNotificationActions()

    // src/components/AnecdoteForm.jsx
const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    
    await create(content) // Esta acción debe hacer el POST al backend
    setNotification(`You created '${content}'`, 5)
}

    return (
    <form onSubmit={addAnecdote}>
        <input name="anecdote" />
        <button type="submit">create</button>
    </form>
    )
}

export default AnecdoteForm