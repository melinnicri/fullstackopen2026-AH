const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

// 1. GET
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// 2. POST (Protegido)
blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user 

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()

  response.status(201).json(savedBlog)
})

// 3. PUT (El que te daba error 404)
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  
  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

// 4. DELETE (Protegido)
blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  if (!user) return response.status(401).json({ error: 'token missing or invalid' })

  const blog = await Blog.findById(request.params.id)
  if (!blog) return response.status(404).json({ error: 'blog not found' })

  if (blog.user.toString() !== user.id.toString()) {
    return response.status(403).json({ error: 'only the creator can delete' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter