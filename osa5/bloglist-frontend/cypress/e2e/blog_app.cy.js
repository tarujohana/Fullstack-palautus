describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'secret'
    }
    cy.request('POST','http://localhost:3003/api/users', user)
    cy.visit('http://localhost:5173')

  })

  it('Login form is shown', function() {
    cy.contains('Login to application')
    cy.get('input[type="text"]')
    cy.get('input[type="password"]')
    cy.contains('login')

  })
})

describe('Login', function (){
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'secret'
    }
    cy.request('POST','http://localhost:3003/api/users', user)
    cy.visit('http://localhost:5173')

  })

it('succeeds with correct credentials', function() {
      cy.get('input[type="text"]').type('testuser')
      cy.get('input[type="password"]').type('secret')
      cy.contains('login').click()

      cy.contains('Test User logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('input[type="text"]').type('testuser')
      cy.get('input[type="password"]').type('wrongpassword')
      cy.contains('login').click()

      cy.contains('Wrong username or password')
      cy.contains('Test User logged in').should('not.exist')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
     cy.login({username: 'testuser', password: 'secret'})
  })

  it('A blog can be created', function() {
    const testBlog ={
      title:'Cypress Blog',
      author: 'Cypress Author',
      url: 'http://cypress.io'
    }

    cy.contains('new blog').click()
    cy.get('#title').type(testBlog.title)
    cy.get('#author').type(testBlog.author)
    cy.get('#url').type(testBlog.url)

    cy.contains('create').click()

  cy.contains(`${testBlog.title} ${testBlog.author}`)
  })

  it('A blog can be liked', function(){
     const testBlog ={
      title:'Cypress Blog',
      author: 'Cypress Author',
      url: 'http://cypress.io'
    }    
    
    cy.createBlog(testBlog)
    cy.contains(`${testBlog.title} ${testBlog.author}`)
    .parent().contains('view').click()
    cy.contains('likes 0')
    cy.contains('like').click()
    cy.contains('likes 1')

  })

  it('A blog can be deleted byt the creator', function(){
     const testBlog ={
      title:'Cypress Blog',
      author: 'Cypress Author',
      url: 'http://cypress.io'
    }

    cy.createBlog(testBlog)

    cy.contains(`${testBlog.title} ${testBlog.author}`)
    .parent().contains('view').click()
    cy.contains('Delete').click()
    cy.contains( `${testBlog.title}  ${testBlog.author}`).should('not.exist')
  })

  it('Only creator can see the delete button', function(){
       const testBlog ={
      title:'Cypress Blog',
      author: 'Cypress Author',
      url: 'http://cypress.io'
    }

    cy.createBlog(testBlog)

    cy.contains(`${testBlog.title} ${testBlog.author}`)
    .parent().contains('view').click()
    cy.contains('Delete')
    cy.contains('logout').click()

    const secondUser ={
      name: 'Second User',
      username: 'seconduser',
      password:'secret2'
    }   
     cy.request('POST', 'http://localhost:3003/api/users', secondUser)
     cy.get('input[type="text"]').type(secondUser.username)
     cy.get('input[type="password"]').type(secondUser.password)
     cy.contains('login').click() 

    cy.contains(`${testBlog.title} ${testBlog.author}`)
    .parent().contains('view').click()

    cy.contains('Delete').should('not.exist')
  })


  })

describe('Several blogs exist', function() {
  let blog1, blog2, blog3

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
     const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'secret'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.login({ username: 'testuser', password: 'secret' })
  })
  
  it('blogs are ordered by likes', function() {
    
    blog1 = { title: 'Least likes', author: 'A', url: 'http://a.com' }
    blog2 = { title: 'Medium likes', author: 'B', url: 'http://b.com' }
    blog3 = { title: 'Most likes', author: 'C', url: 'http://c.com' }

    cy.createBlog(blog1)
    cy.createBlog(blog2)
    cy.createBlog(blog3)
  
    cy.get('.blog').eq(0).should('contain', blog1.title) 
    cy.get('.blog').eq(1).should('contain', blog2.title) 
    cy.get('.blog').eq(2).should('contain', blog3.title) 

    cy.get('.blog').eq(2).find('#visibility').click()
    cy.contains('likes 0')
    cy.get('#like').click()
    cy.contains('likes 1')

    cy.get('.blog').eq(0).should('contain', blog3.title) 
    cy.get('.blog').eq(1).should('contain', blog1.title) 
    cy.get('.blog').eq(2).should('contain', blog2.title)
})

})

  



