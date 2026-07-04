const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
    const response = await fetch(baseUrl)
    if (!response.ok) {
        throw new Error('Failed to fetch anecdotes')
    }
    return response.json()
}

export const createAnecdote = async (newAnecdote) => {
    const response = await fetch('http://localhost:3001/anecdotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnecdote)
    })
    
    if (!response.ok) {
    throw new Error('Server error: content must be at least 5 characters')
    }
    return response.json()
}

export const updateAnecdote = async (anecdote) => {
    const response = await fetch(`http://localhost:3001/anecdotes/${anecdote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...anecdote, votes: anecdote.votes + 1 }),
    })
    if (!response.ok) throw new Error('Failed to update')
    return response.json()
}