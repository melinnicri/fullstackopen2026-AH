import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from '../requests'
import { useNotify } from '../NotificationContext' // Importa el hook que simplifica todo

export const useAnecdoteQueries = () => {
    const queryClient = useQueryClient()
    const notify = useNotify() // Usamos el hook nuevo aquí

    const result = useQuery({
        queryKey: ['anecdotes'],
        queryFn: getAnecdotes,
        retry: false
    })

    const voteMutation = useMutation({
        mutationFn: updateAnecdote,
        onSuccess: (updatedAnecdote) => {
            queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
            
        notify(`anecdote '${updatedAnecdote.content}' voted`)
    }
    })

    return { result, voteMutation }
}