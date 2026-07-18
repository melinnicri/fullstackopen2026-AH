import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import blogService from '../services/blogs'

const BlogList = () => {
    const queryClient = useQueryClient()

    const { data: blogs, isLoading } = useQuery({ 
        queryKey: ['blogs'], 
        queryFn: blogService.getAll 
    })

    const likeMutation = useMutation({
        mutationFn: blogService.update,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
        },
    })

    if (isLoading) return <div>Cargando blogs...</div>
    
    const sortedBlogs = [...(blogs || [])].sort((a, b) => b.likes - a.likes)

    const handleLike = (blog) => {
        likeMutation.mutate({ ...blog, likes: blog.likes + 1 })
    }

    return (
        <div>
            <h2>Blogs</h2>
            {sortedBlogs.map(blog => (
                <div key={blog.id} style={{ marginBottom: '10px' }}>
                    <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                    <button onClick={() => handleLike(blog)}>like</button>
                </div>
            ))}
        </div>
    )
}

export default BlogList