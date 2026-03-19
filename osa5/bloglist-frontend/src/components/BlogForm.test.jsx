import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import BlogForm from './BlogForm'
import { vi } from 'vitest'

test('calls createBlog with correct data when form is submitted', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()

    render (<BlogForm createBlog = {createBlog}/>)

    const inputs = screen.getAllByRole('textbox')

    await user.type(inputs[0], 'Test Title')
    await user.type(inputs[1], 'Test Author')
    await user.type(inputs[2], 'http://test.com')

    const button = screen.getByText('create')
    await user.click(button)

    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog).toHaveBeenCalledWith({
    title: 'Test Title',
    author: 'Test Author',
    url: 'http://test.com'
  })

})