const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const assert = require('assert')    
const helper = require('./test_helper')
const user = require('../models/user')
const bcrypt = require('bcrypt')    
const api = supertest(app)
let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await user.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const testUser = new user({
     username: 'testuser',
     passwordHash
    })

  await testUser.save()

  const loginResponse = await api
    .post('/api/login')
    .send({
         username: 'testuser',
         password: 'sekret' 
        })

  token = loginResponse.body.token
  const blogObjects = helper.initialBlogs.map(blog => new Blog({ ...blog, user: testUser._id }))
  await Promise.all(blogObjects.map(blog => blog.save()))
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async() =>{
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('unique identifier property of the blog posts is named id', async() => {
    const response = await api.get('/api/blogs')
    const blogs = response.body

    blogs.forEach(blog => {
        assert.ok(blog.id)
    })  
})

test('a valid blog can be added', async() => {
    const newBlog = {
        title: 'Testi',
        author: 'Test User',
        url: 'https://test.com',
        likes: 10
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title) 
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    assert(titles.includes('Testi'))
})

test('if likes property is missing, it will be set to 0', async() => {
    const newBlog = {
        title: 'Test no likes',
        author: 'Tester',
        url: 'https://testnolikes.com'
    } 
    const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
    assert.strictEqual(response.body.likes, 0)
})

test('blog without title is not added', async() => {
    const newBlog = { 
        author: 'Tester',
        url: 'https://testnolikes.com',
        likes: 5
    }

    await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
})

test('blog without url is not added', async() => {
    const newBlog = { 
        title: 'Test no url',
        author: 'Tester',
        likes: 5
    }

        await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
})


test('a blog can be deleted', async() => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
       .delete(`/api/blogs/${blogToDelete.id}`)
       .set('Authorization', `Bearer ${token}`)
       .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)        

    })

test('a blog can be updated', async()=>{
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const updatedBlog = {
         ...blogToUpdate,
        likes: blogToUpdate.likes + 1
    }

    const response = await api.put(`/api/blogs/${blogToUpdate.id}`)
     .send(updatedBlog)
     .expect(200)
     .expect('Content-Type', /application\/json/)
     
     assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
})


after(async () => {
  await mongoose.connection.close()
})