import { useParams } from 'react-router-dom'

const BlogView = ({ blogs, handleLike, handleDelete, user }) => {
    const id = useParams().id
    const blog = blogs.find(b => b.id === id)

    if (!blog) return null

  // Filtramos blogs del mismo autor
    const blogsDelAutor = blogs.filter(b => b.user?.id === blog.user?.id || b.user?.name === blog.user?.name)

    return (
        <div className="blog-card">
        <h2>{blog.title}</h2>
        <a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a>
        
        {/* Contenedor Flex para alinear los elementos */}
        <div className="button-group">
            <p><strong>{blog.likes} likes</strong></p>
            <button onClick={() => handleLike(blog)}>LIKE</button>
        
            {user && blog.user?.username === user.username && (
            <button className="remove-btn" onClick={() => handleDelete(blog)}>REMOVE</button>
        )}
        </div>
        
        <p>Added by: {blog.user?.name || 'Anonymous'}</p>
        
        <h3>More blogs by {blog.user?.name || 'this author'}:</h3>
        <ul>
            {blogsDelAutor
            .filter(b => b.id !== blog.id)
            .map(b => (
                <li key={b.id}>{b.title}</li>
        ))}
        </ul>
    </div>
    )
}

export default BlogView