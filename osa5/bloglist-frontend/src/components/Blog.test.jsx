import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import Blog from './Blog'
import { vi } from 'vitest'


test('renders title and author, but not url or likes by default', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('Test Blog Test Author')
  const urlElement = screen.queryByText('http://test.com')
  const likesElement = screen.queryByText('likes 5')

  expect(element).toBeDefined()
  expect(urlElement).toBeNull()
  expect(likesElement).toBeNull()
})

test('renders url and likes when view button is clicked', async () => {
    const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  render(<Blog blog={blog}  />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const urlElement = screen.getByText('http://test.com')
    const likesElement = screen.getByText('likes 5')
    const userElement = screen.getByText('Test User')

    expect(urlElement).toBeDefined()
    expect(likesElement).toBeDefined()
    expect(userElement).toBeDefined()
  })


  test('Like button calls event handler twice when clicked twice', async () => {
    const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

    const mockHandler = vi.fn()
    render(<Blog blog={blog} likeBlog={mockHandler} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)

  })

