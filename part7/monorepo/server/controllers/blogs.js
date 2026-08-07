const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
  } catch (error) { next(error) }
})

blogRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).json({ error: 'blog not found' })
    }
  } catch (error) { next(error) }
})

blogRouter.post('/', async (request, response, next) => {
  try {
    const { title, author, url, likes } = request.body
    const user = request.user 

    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = new Blog({
      title, author, url,
      likes: likes || 0,
      user: user._id,
      comments: []
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) { next(error) }
})

blogRouter.post('/:id/comments', async (request, response, next) => {
  try {
    const { comment } = request.body
    const blog = await Blog.findById(request.params.id)
    if (!blog) return response.status(404).json({ error: 'blog not found' })

    blog.comments = blog.comments.concat(comment)
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch (error) { next(error) }
})

blogRouter.put('/:id', async (request, response, next) => {
    const body = request.body
    const blog = {
        likes: body.likes,
    }
    const updatedBlog = await Blog.findByIdAndUpdate(id, blogData, { returnDocument: 'after' })??
    response.json(updatedBlog)
})

blogRouter.delete('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (!blog) return response.status(204).end()

    await Blog.findByIdAndDelete(request.params.id)
    
    const user = await User.findById(blog.user)
    if (user) {
      user.blogs = user.blogs.filter(b => b.toString() !== request.params.id.toString())
      await user.save()
    }
    response.status(204).end()
  } catch (error) { next(error) }
})

module.exports = blogRouter