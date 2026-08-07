import { useState, useEffect } from 'react'
import { useQuery, useSubscription, useApolloClient } from '@apollo/client'
import { ALL_BOOKS, BOOK_ADDED } from './queries'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'

const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('books')
  const [errorMessage, setErrorMessage] = useState(null)
  
  const { data, loading, error } = useQuery(ALL_BOOKS)
  const client = useApolloClient()

  useEffect(() => {
    const savedToken = localStorage.getItem('library-user-token')
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

  useSubscription(BOOK_ADDED, {
    onData: ({ client, data }) => {
      const addedBook = data.data.bookAdded
      window.alert(`¡Nuevo libro añadido: ${addedBook.title}!`)
      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        if (allBooks.some(b => b.id === addedBook.id)) {
          return { allBooks }
        }
        return { allBooks: allBooks.concat(addedBook) }
      })
    }
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('books')
  }

  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error al cargar los datos</div>

  return (
    <div>
      <div>
        <button onClick={() => setPage('books')}>libros</button>
        {token ? (
          <>
            <button onClick={() => setPage('add')}>agregar libro</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      <LoginForm
        setToken={setToken}
        setError={setErrorMessage}
        page={page}
      />

      {page === 'books' && (
        <div>
          <h2>Libros ({data.allBooks.length})</h2>
          {data.allBooks.map((book) => (
            <div key={book.title}>
              {book.title} por {book.author.name}
            </div>
          ))}
        </div>
      )}

      {page === 'add' && token && <NewBook />}
    </div>
  )
}

export default App