import axios from 'axios'
const baseUrl = 'http://localhost:3001/anecdotes'

const remove = async (id) => {
    const response = await axios.delete(`${baseUrl}/${id}`)
    return response.data
}

const getAll = async () => {
    const response = await fetch(baseUrl)
    return response.json()
}

const createNew = async (content) => {
    const object = { content, votes: 0 }
    const response = await axios.post(baseUrl, object)
    return response.data
}

const updateVotes = async (anecdote) => {
    const updated = { ...anecdote, votes: anecdote.votes + 1 }
    const response = await fetch(`${baseUrl}/${anecdote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ votes: updated.votes })
    })
    return response.json()
}

export default { getAll, createNew, updateVotes, remove }