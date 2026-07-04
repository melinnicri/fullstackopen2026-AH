const Blog = require('../models/blog')

const initialBlogs = [
    {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
    },
    {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD0808.html",
    likes: 12
    }
]

const nonExistingId = async () => {
    const blog = new Blog({ title: 'willremovethissoon', author: 'temp', url: 'http://temp.com' })
    await blog.save()
    await blog.deleteOne()
    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs,
    nonExistingId,
    blogsInDb
}