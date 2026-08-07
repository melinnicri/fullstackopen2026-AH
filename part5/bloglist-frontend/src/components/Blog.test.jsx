import userEvent from '@testing-library/user-event' // 🚀 AGREGA ESTA LÍNEA
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renderiza el título y el autor, pero oculta la URL y los likes por defecto', () => {
    const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Full Stack Open',
    url: 'https://fullstackopen.com',
    likes: 5,
    user: {
        name: 'Test User'
    }
    }

  // Renderizamos el componente pasándole las props que normalmente requiere
    render(<Blog blog={blog} currentUser={{ name: 'Test User' }} />)

  // Verificamos que el título esté en el documento
    const titleElement = screen.getByText(/Component testing is done with react-testing-library/i)
    expect(titleElement).toBeInTheDocument()

  // Verificamos que la URL NO esté visible inicialmente (ej. usando queryByText)
    const urlElement = screen.queryByText('https://fullstackopen.com')
  expect(urlElement).toBeNull() // O expect(urlElement).not.toBeVisible() según cómo lo ocultes en tu CSS
})

// --- 📝 NUEVA PRUEBA PARA EL EJERCICIO 5.14 ---
test('muestra la URL y los likes cuando se hace clic en el botón de expandir', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Full Stack Open',
    url: 'https://fullstackopen.com',
    likes: 5,
    user: {
      name: 'Test User'
    }
  }

  render(<Blog blog={blog} currentUser={{ name: 'Test User' }} />)

  // 1. Iniciamos la sesión de simulación del usuario
  const user = userEvent.setup()

  // 2. Buscamos el botón que expande la información. 
  // ⚠️ Cambia 'view' por el texto exacto que tenga tu botón (ej. 'ver', 'show', etc.)
  const button = screen.getByText('view')
  
  // 3. Simulamos el clic en el botón (lleva "await" porque es una acción asíncrona)
  await user.click(button)

  // 4. Verificamos que tras el clic, la URL y los likes estén en el documento
  const urlElement = screen.getByText('https://fullstackopen.com')
  expect(urlElement).toBeInTheDocument()

  // Buscamos los likes. Usamos un Regex (/5/ o /likes/) según cómo muestres el texto en tu componente
  const likesElement = screen.getByText(/5/) 
  expect(likesElement).toBeInTheDocument()
})

test('si se hace clic en el botón de like dos veces, el controlador de eventos se llama dos veces', async () => {
  const blog = {
    title: 'Testing react apps with vitest',
    author: 'Full Stack Open',
    url: 'https://fullstackopen.com',
    likes: 5,
    user: {
      name: 'Test User'
    }
  }

  const mockHandler = vi.fn()

  // 🚀 CAMBIAMOS handleLike={mockHandler} POR updateLikes={mockHandler}
  render(<Blog blog={blog} updateLikes={mockHandler} currentUser={{ name: 'Test User' }} />)

  const user = userEvent.setup()

  const viewButton = screen.getByText('view') // o 'ver' si está en español
  await user.click(viewButton)

  const likeButton = screen.getByText('like') // o 'me gusta' si está en español
  
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})