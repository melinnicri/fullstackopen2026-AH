import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '', 
  actions: {
    initialize: async () => {
      const data = await anecdoteService.getAll()
      set({ anecdotes: data })
    },
    create: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)
      set((state) => ({
        anecdotes: [...state.anecdotes, newAnecdote]
      }))
    },
    vote: async (id) => {
      const state = useAnecdoteStore.getState()
      const anecdoteToVote = state.anecdotes.find(a => a.id === id)
      const updatedAnecdote = await anecdoteService.updateVotes(anecdoteToVote)
      
      console.log('Anécdota actualizada tras votar:', updatedAnecdote)

      set((state) => ({
        anecdotes: state.anecdotes.map((anec) => 
          anec.id === id ? updatedAnecdote : anec
        )
      }))
    },
    remove: async (id) => {
      await anecdoteService.remove(id)
      set((state) => ({
        anecdotes: state.anecdotes.filter(a => a.id !== id)
      }))
    },
    setFilter: (value) => set({ filter: value })
  }
}))

export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)
export const useFilter = () => useAnecdoteStore(state => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore(state => state.actions)

export const useVisibleAnecdotes = () => {
  const anecdotes = useAnecdoteStore(state => state.anecdotes)
  const filter = useAnecdoteStore(state => state.filter)

  const filtered = anecdotes.filter(a => 
    a.content.toLowerCase().includes(filter.toLowerCase())
  )

  return [...filtered].sort((a, b) => b.votes - a.votes)
}