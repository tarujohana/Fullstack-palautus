const blogRouter= require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware') 

// Get all blog posts
blogRouter.get('/',async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// Create a new blog post
blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  
   if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title and url are required' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
   })

  const savedBlog = await blog.save()
  
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

// Delete a blog post by ID
blogRouter.delete('/:id', middleware.userExtractor,async (request,response)=> {
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  if (blog.user.toString() !== user.id.toString()) {
    return response.status(403).json({ error: 'only the creator can delete the blog' })
  }

   await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()  
})

// Update a blog post by ID
blogRouter.put('/:id', async (request, response) => {
    try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true }
    )
    response.json(updatedBlog)

  } catch (error) {
    response.status(400).json({ error: 'malformatted id' })
  }     

})

module.exports = blogRouter 