import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'

const BlogView = () => {
    const { id } = useParams()
    const [comment, setComment] = useState('')
    const queryClient = useQueryClient()

    const { data: blog, isLoading, error } = useQuery({
        queryKey: ['blog', id],
        queryFn: () => blogService.getOne(id)
    })

    const likeMutation = useMutation({
        mutationFn: blogService.update,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blog', id] })
    })

    const commentMutation = useMutation({
    mutationFn: ({ id, comment }) => blogService.addComment(id, comment),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['blog', id] })
    }
})

    if (isLoading) return <div>Cargando...</div>
    if (error) return <div>Error al cargar el blog: {error.message}</div>
    if (!blog) return <div>Blog no encontrado</div>

    return (
        <div>
            <h2>{blog.title}</h2>
            
            <div>by {blog.author}</div>
            
            <a href={blog.url} target="_blank" rel="noreferrer">{blog.url || 'Sin URL'}</a>
            
            <p>Added by {blog.user?.name || 'anónimo'}</p>
            
            <div>
                {blog.likes} likes 
                <button onClick={() => likeMutation.mutate({ ...blog, likes: blog.likes + 1 })}>
                    LIKE
                </button>
            </div>

            <h3>comments</h3>
            <form onSubmit={(e) => {
                e.preventDefault()
                if (comment.trim() === '') return
                commentMutation.mutate({ id: blog.id, comment })
                setComment('')
            }}>
                <input value={comment} onChange={(e) => setComment(e.target.value)} />
                <button type="submit">add comment</button>
            </form>
            <ul>
                {blog.comments?.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
        </div>
    )
}

export default BlogView