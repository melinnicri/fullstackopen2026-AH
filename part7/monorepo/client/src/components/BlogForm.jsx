import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'

const BlogForm = () => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')
    const queryClient = useQueryClient()

    const newBlogMutation = useMutation({
        mutationFn: blogService.createNew,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
            setTitle('')
            setAuthor('')
            setUrl('')
        }
    })

    const addBlog = (event) => {
        event.preventDefault()
        newBlogMutation.mutate({ title, author, url }) 
    }

    return (
        <form onSubmit={addBlog}>
            <h2>Create new</h2>
            <div>
                Title: <input value={title} onChange={({target}) => setTitle(target.value)} />
            </div>
            <div>
                Author: <input value={author} onChange={({target}) => setAuthor(target.value)} />
            </div>
            <div>
                URL: <input value={url} onChange={({target}) => setUrl(target.value)} />
            </div>
            <button type="submit" disabled={newBlogMutation.isPending}>
                {newBlogMutation.isPending ? 'Creating...' : 'create'}
            </button>
        </form>
    )
}

export default BlogForm