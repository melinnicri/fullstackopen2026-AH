import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, test, expect, vi } from 'vitest'
import BlogView from './BlogView'

describe('<BlogView />', () => {
    const blog = {
        id: '1', // Es importante añadir el ID para que coincida con el route param
        title: 'Testing routes',
        author: 'Fullstack Open',
        url: 'http://example.com',
        likes: 10,
        user: { name: 'Admin', username: 'adminuser' }
    }

    test('usuario no registrado: ve info pero NO ve botones', () => {
        render(
        <MemoryRouter initialEntries={['/blogs/1']}>
        <Routes>
            <Route path="/blogs/:id" element={<BlogView blogs={[blog]} user={null} />} />
        </Routes>
        </MemoryRouter>
    )
    
    expect(screen.getByText('Testing routes')).toBeDefined()
    expect(screen.getByText('10 likes')).toBeDefined()
    
    // Verificamos que los botones no estén en el DOM
    expect(screen.queryByRole('button', { name: /like/i })).toBeNull()
    expect(screen.queryByRole('button', { name: /remove/i })).toBeNull()
    })

    test('usuario logueado (no creador): ve botón de like pero NO de eliminar', () => {
        const user = { username: 'otheruser' }
        render(
        <MemoryRouter initialEntries={['/blogs/1']}>
            <Routes>
            <Route path="/blogs/:id" element={<BlogView blogs={[blog]} user={user} handleLike={vi.fn()} />} />
        </Routes>
        </MemoryRouter>
    )
    
    expect(screen.getByRole('button', { name: /like/i })).toBeDefined()
    expect(screen.queryByRole('button', { name: /remove/i })).toBeNull()
    })

    test('creador del blog: ve botón de like Y botón de eliminar', () => {
        const creator = { username: 'adminuser' }
        render(
        <MemoryRouter initialEntries={['/blogs/1']}>
            <Routes>
            <Route path="/blogs/:id" element={
            <BlogView blogs={[blog]} user={creator} handleLike={vi.fn()} handleDelete={vi.fn()} />
            } />
        </Routes>
        </MemoryRouter>
    )
    
    expect(screen.getByRole('button', { name: /like/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /remove/i })).toBeDefined()
    })
})