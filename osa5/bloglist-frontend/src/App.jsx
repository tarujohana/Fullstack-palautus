import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)  
  const [notification, setNotification] = useState(null)  

  const blogFormRef = useRef() 


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

 useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try{
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(user)
      )
      blogService.setToken(user.token)  
      setUser(user)
      setUsername('')
      setPassword('')
      showNotification(`Welcome ${user.name}!`)
    } catch (error) {
      showNotification('Wrong username or password', 'error')
    } 
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)    
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
        <input
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        </label>
      </div>
      <div>
        <label>
          password
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  if (user === null){
    return (
      <div>
        <Notification notification={notification} />
        <h2> Login to application </h2>
        {loginForm()}
       </div>
     )
  } 

  const addBlog = async (blogObject) => {
    try{
      const newBlog = await blogService.create(blogObject)
      newBlog.user = user 
      setBlogs(blogs.concat(newBlog))
      showNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      blogFormRef.current.toggleVisibility() 
    } catch (error) {
      showNotification('Error adding blog', 'error')
    }  
  }

const likeBlog = async (blog) => {
  try {
    const blogId = blog.id || blog._id
    const updatedBlog = {
      user: blog.user.id || blog.user._id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    const returnedBlog = await blogService.update(blogId, updatedBlog)
    if (!returnedBlog.user || typeof returnedBlog.user === 'string') {
      returnedBlog.user = blog.user
    }

    setBlogs(blogs.map(b => {
      const bId = b.id || b._id
      return bId === blogId ? returnedBlog : b
    }))
  } catch (error) {
    console.error('Error liking blog:', error)
  }
}

const deleteBlog = async (blog) => {
  window.confirm(`Delete ${blog.title} by ${blog.author}?`)
  try {
    const blogId = blog.id || blog._id
    await blogService.remove(blogId)
    setBlogs(blogs.filter(b => (b.id || b._id) !== blogId))
    showNotification(`Deleted ${blog.title} by ${blog.author}`)
  } catch (error) {
    console.log('Error deleting blog:', error)
    showNotification('Error deleting blog', 'error')
  }
}

 const userBlogs = blogs
 //.filter(blog => blog.user &&blog.user.username === user.username)
 .sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <Notification notification={notification} />  
      <h2>Blogs</h2>
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>  
        </p>
      {userBlogs.map(blog =>
        <Blog key={blog.id} blog={blog} likeBlog={likeBlog} deleteBlog={deleteBlog} user = {user}/>
      )}
      <h2> Create new </h2>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
    </div>
  )
}

export default App