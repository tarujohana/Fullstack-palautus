const { test, after, beforeEach, describe } = require('node:test')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('../models/user')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const assert = require('assert')
const api = supertest(app)


describe('when there is initially one user in db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
    
      const passwordHash =await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
      await user.save()
    })


test('A valid user can be created', async () => {
  const usersAtStart = await helper.usersInDb()

    const newUser ={
        username:'newuser',
        name:'New User',
        password:'newpassword123'
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    
    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))  
})


test('User with too short username cannot be created', async () => {
  const usersAtStart = await helper.usersInDb() 
    const newUser = {
      username: 'us',
      name: 'Short Username',
      password: 'validpassword'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert(result.body.error.includes('Username must be at least 3 characters long'))
  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('User with too short password cannot be created', async () => {
  const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'validuser',
      name: 'Short Password',
      password: 'pw'
  } 

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)
  assert(result.body.error.includes('Password must be at least 3 characters long'))

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length)  

})


test('Username must be unique', async () => {
  const  usersAtStart = await helper.usersInDb()
  
  const newUser ={
    username: 'root',
    name: 'Duplicate User',
    password: 'validpassword'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)  

  const usersAtEnd = await helper.usersInDb()
  assert(result.body.error.includes('expected `username` to be unique'))

  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  
  })

})

after(async () => {
  await mongoose.connection.close()
})