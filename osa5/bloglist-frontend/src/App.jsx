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
      setBlogs(blogs.concat(newBlog))
      showNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`) 
    } catch (error) {
      showNotification('Error adding blog', 'error')
    }  
  }


 const userBlogs = blogs.filter(blog => blog.user.username === user.username)

  return (
    <div>
      <Notification notification={notification} />  
      <h2>Blogs</h2>
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>  
        </p>
      {userBlogs.map(blog =>
        <Blog key={blog.id} blog={blog}/>
      )}
      <h2> Create new </h2>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
    </div>
  )
}

export default App