import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> llama al controlador de eventos con los detalles correctos al crear un blog', async () => {
  // 1. Creamos la función simulada (Mock) con Vitest
    const createBlog = vi.fn()
    const user = userEvent.setup()

  // 2. Renderizamos el formulario pasándole el Mock en la prop correspondiente
  // (Asegúrate de que en tu BlogForm.jsx la prop se llame 'createBlog')
    render(<BlogForm createBlog={createBlog} />)

  // render(<BlogForm createBlog={createBlog} />) <-- Esto se queda igual

  // 3. Modificamos la búsqueda para capturar los inputs por su orden en el HTML
    const inputs = screen.getAllByRole('textbox')
  const titleInput = inputs[0]  // El primer input es el de title
  const authorInput = inputs[1] // El segundo input es el de author
  const urlInput = inputs[2]    // El tercer input es el de url
    
  // El botón se queda igual porque sí dice 'create'
    const sendButton = screen.getByText('create')
    
  // 4. Simulamos que el usuario escribe en cada uno de los inputs
    await user.type(titleInput, 'Testing forms with React Testing Library')
    await user.type(authorInput, 'Full Stack Open')
    await user.type(urlInput, 'https://fullstackopen.com')

  // 5. Simulamos el clic para enviar el formulario
    await user.click(sendButton)

  // 6. Verificaciones (Assertions)
  // Comprobamos que la función controladora haya sido llamada exactamente 1 vez
    expect(createBlog.mock.calls).toHaveLength(1)
    
  // Comprobamos que el objeto enviado en el primer argumento [0][0] contenga los datos correctos
    expect(createBlog.mock.calls[0][0].title).toBe('Testing forms with React Testing Library')
    expect(createBlog.mock.calls[0][0].author).toBe('Full Stack Open')
    expect(createBlog.mock.calls[0][0].url).toBe('https://fullstackopen.com')
})