## Tarea Capítulo 8:

## Backend:

## 18. Listing books: Implementar la consulta de libros.
Del servidor:

backend/resolvers.js:

```
const Author = require('./models/author')
const Book = require('./models/book')

const resolvers = {
    Query: {
        bookCount: async () => Book.collection.countDocuments(),
        authorCount: async () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {
        let query = {}
        if (args.author) {
            const author = await Author.findOne({ name: args.author })
            query.author = author._id
        }
        if (args.genre) {
        query.genres = { $in: [args.genre] }
        }
        return Book.find(query).populate('author')
    },
    allAuthors: async () => {
        const authors = await Author.find({})
        return Promise.all(authors.map(async (author) => {
            const count = await Book.countDocuments({ author: author._id })
            return {
            name: author.name,
            born: author.born,
            bookCount: count,
            id: author._id
        }
        }))
    }
    },
    Mutation: {
    addBook: async (root, args) => {
        let author = await Author.findOne({ name: args.author })
        
            if (!author) {
            author = new Author({ name: args.author })
            await author.save()
        }

        const book = new Book({ ...args, author: author._id })
        await book.save()
        
        return book.populate('author')
    },
    editAuthor: async (root, args) => {
        const author = await Author.findOne({ name: args.name })
        if (!author) return null
        
        author.born = args.setBornTo
        return author.save()
    }
    }
}

module.exports = resolvers
```

backend/schema.js

```
const typeDefs = `
    type Author {
        name: String!
        born: Int
        bookCount: Int
        id: ID!
    }

    type Book {
        title: String!
        published: Int!
        author: Author!
        genres: [String!]!
        id: ID!
    }

    type Query {
        bookCount: Int!
        authorCount: Int!
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]!
    }

    type Mutation {
        addBook(
            title: String!,
            author: String!,
            published: Int!,
            genres: [String!]!
    ): Book
    editAuthor(
        name: String!,
        setBornTo: Int!
    ): Author
    }
`
module.exports = typeDefs
```

Del cliente:

frontend/App.jsx:

```
import { gql, useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'

const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      author { name }
      genres
      id
    }
  }
`

const ADD_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      title
      author { name }
    }
  }
`

const App = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const result = useQuery(ALL_BOOKS)
  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }]
  })

  const submit = async (event) => {
    event.preventDefault()
    
    await addBook({ variables: { 
      title, author, published: parseInt(published), genres 
    }})

    setTitle('')
    setAuthor('')
    setPublished('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  if (result.loading) return <div>cargando...</div>

  return (
    <div>
      <h1>Libros</h1>
      <pre>{JSON.stringify(result.data.allBooks, null, 2)}</pre>

      <h2>Agregar nuevo libro</h2>
      <form onSubmit={submit}>
        <div>título <input value={title} onChange={({target}) => setTitle(target.value)} /></div>
        <div>autor <input value={author} onChange={({target}) => setAuthor(target.value)} /></div>
        <div>publicado <input type="number" value={published} onChange={({target}) => setPublished(target.value)} /></div>
        <div>
          <input value={genre} onChange={({target}) => setGenre(target.value)} />
          <button onClick={addGenre} type="button">agregar género</button>
        </div>
        <div>géneros: {genres.join(' ')}</div>
        <button type="submit">crear libro</button>
      </form>
    </div>
  )
}

export default App
```


## 19. Log in: Implementar la lógica de autenticación en el servidor.
Backend:

schema.js:

```
const { gql } = require('graphql-tag')

const typeDefs = gql`
    type Book {
    title: String!
    author: Author!
    published: Int
    genres: [String]
    id: ID!
}

    type Author {
        name: String!
        born: Int
        bookCount: Int
        id: ID!
    }

    type Token {
        value: String!
    }

    type Query {
        bookCount: Int!
        authorCount: Int!
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]!
    }

    type Mutation {
        addBook(title: String!, author: String!, published: Int!, genres: [String!]!): Book
        editAuthor(name: String!, setBornTo: Int!): Author
        login(username: String!, password: String!): Token
    }
`

module.exports = typeDefs
```

resolvers.js:

```
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

const resolvers = {
    Query: {
        bookCount: async () => Book.collection.countDocuments(),
        authorCount: async () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {
        let query = {}
        if (args.author) {
            const author = await Author.findOne({ name: args.author })
            query.author = author ? author._id : null
        }
        if (args.genre) {
            query.genres = { $in: [args.genre] }
        }
        return Book.find(query).populate('author')
    },
    allAuthors: async () => {
        const authors = await Author.find({})
        return Promise.all(authors.map(async (author) => {
        const count = await Book.countDocuments({ author: author._id })
        return {
            name: author.name,
            born: author.born,
            bookCount: count,
            id: author._id
        }
        }))
    }
    },

    Mutation: {
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })

        if (!user || args.password !== 'secreto') {
        throw new Error("credenciales incorrectas")
        }

        const userForToken = {
            username: user.username,
            id: user._id,
        }

        return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
    addBook: async (root, args) => {
        let author = await Author.findOne({ name: args.author })
        if (!author) {
            author = new Author({ name: args.author })
            await author.save()
        }
        const book = new Book({ ...args, author: author._id })
        await book.save()
        return book.populate('author')
    },
    editAuthor: async (root, args) => {
        const author = await Author.findOne({ name: args.name })
        if (!author) return null
        author.born = args.setBornTo
        return author.save()
    }
    }
}

module.exports = resolvers
```

index.js:

```
require('dotenv').config()

if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
    console.error('ERROR: Faltan variables de entorno necesarias.')
    process.exit(1)
}

const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('./models/user')

const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const MONGODB_URI = process.env.MONGODB_URI

console.log('conectando a MongoDB...')

mongoose.set('strictQuery', false)
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('conectado a MongoDB')
    })
    .catch((error) => {
        console.log('error de conexión a MongoDB:', error.message)
    })

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
            try {
                const decodedToken = jwt.verify(
                    auth.substring(7), process.env.JWT_SECRET
                )
                const currentUser = await User.findById(decodedToken.id)
                return { currentUser }
            } catch (error) {
                return null
            }
        }
    },
}).then(({ url }) => {
    console.log(`🚀 Servidor listo en ${url}`)
})
```

user.js

```
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    }
})

module.exports = mongoose.model('User', schema)
```


Frontend:

LoginForm.jsx:

```
import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ setToken }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [login] = useMutation(LOGIN, {
        onCompleted: ({ login }) => {
            const token = login.value
            localStorage.setItem('library-user-token', token)
            setToken(token) 
    },
    onError: (error) => {
        console.log(error.graphQLErrors[0].message)
    }
    })

    const submit = async (event) => {
        event.preventDefault()
        login({ variables: { username, password } })
    }

    return (
    <div>
        <form onSubmit={submit}>
        <div>
            username <input value={username} onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
            password <input type='password' value={password} onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button type='submit'>login</button>
        </form>
    </div>
    )
}

export default LoginForm
```

queries.js:

```
import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
            born
            bookCount
        }
    }
`

export const ALL_BOOKS = gql`
    query {
        allBooks {
            title
            published
            genres
        }
    }
`

export const ADD_BOOK = gql`
    mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
        addBook(title: $title, author: $author, published: $published, genres: $genres) {
            title
            published
            genres
        }
    }
`

export const EDIT_AUTHOR = gql`
    mutation editAuthor($name: String!, $setBornTo: Int!) {
        editAuthor(name: $name, setBornTo: $setBornTo) {
            name
            born
        }
    }
`

export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            value
        }
    }
`
```

main.jsx:

```
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from '@apollo/client'
import './index.css'
import App from './App.jsx'

const httpLink = new HttpLink({
  uri: 'http://localhost:4000',
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
```

App.jsx:

```
import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { ALL_BOOKS, ADD_BOOK } from './queries'

const App = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const result = useQuery(ALL_BOOKS)
  
  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }]
  })

  if (result.loading) return <div>cargando...</div>

    if (result.error) {
    console.error('Error de Apollo:', result.error)
    return <div>Error al cargar los libros: {result.error.message}</div>
  }

  const submit = async (event) => {
    event.preventDefault()
    
    await addBook({ variables: { 
      title, author, published: parseInt(published), genres 
    }})

    setTitle('')
    setAuthor('')
    setPublished('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

    if (!result.data || !result.data.allBooks) {
    return <div>No hay libros disponibles.</div>
  }

  return (
    <div>
      <h1>Libros</h1>
      <pre>{JSON.stringify(result.data.allBooks, null, 2)}</pre>

      <h2>Agregar nuevo libro</h2>
      <form onSubmit={submit}>
        <div>título <input value={title} onChange={({target}) => setTitle(target.value)} /></div>
        <div>autor <input value={author} onChange={({target}) => setAuthor(target.value)} /></div>
        <div>publicado <input type="number" value={published} onChange={({target}) => setPublished(target.value)} /></div>
        <div>
          <input value={genre} onChange={({target}) => setGenre(target.value)} />
          <button onClick={addGenre} type="button">agregar género</button>
        </div>
        <div>géneros: {genres.join(' ')}</div>
        <button type="submit">crear libro</button>
      </form>
    </div>
  )
}

export default App
```

user.js:

```
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    }
})

module.exports = mongoose.model('User', schema)
```


## 20 - 22. Books by genre: Crear consultas que acepten filtros de género usando GraphQL.

schema.js:

```
const { gql } = require('graphql-tag')

const typeDefs = gql`
    type Book {
    title: String!
    author: Author!
    published: Int
    genres: [String]
    id: ID!
}

    type Author {
        name: String!
        born: Int
        bookCount: Int
        id: ID!
    }

    type Token {
        value: String!
    }

    type Query {
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]!
    }

    type Mutation {
        addBook(title: String!, author: String!, published: Int!, genres: [String!]!): Book
        editAuthor(name: String!, setBornTo: Int!): Author
        login(username: String!, password: String!): Token
    }
`

module.exports = typeDefs
```

queries.js:

```
import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
            born
            bookCount
        }
    }
`

export const ALL_BOOKS = gql`
    query allBooks($genre: String) {
        allBooks(genre: $genre) {
            title
            published
            genres
            author {
                name
            }
        }
    }
`

export const ADD_BOOK = gql`
    mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
        addBook(title: $title, author: $author, published: $published, genres: $genres) {
            title
            published
            genres
        }
    }
`

export const EDIT_AUTHOR = gql`
    mutation editAuthor($name: String!, $setBornTo: Int!) {
        editAuthor(name: $name, setBornTo: $setBornTo) {
            name
            born
        }
    }
`

export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            value
        }
    }
`
```

resolvers.js:

```
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

const resolvers = {
    Query: {
        allBooks: async (root, args) => {
    if (!args.author && !args.genre) {
        return Book.find({}).populate('author')
    }

    if (args.genre) {
        return Book.find({ genres: { $in: [args.genre] } }).populate('author')
    }
    
    return Book.find({}).populate('author')
},

        allAuthors: async () => {
            const authors = await Author.find({})
            return Promise.all(authors.map(async (author) => {
            const count = await Book.countDocuments({ author: author._id })
            return {
                name: author.name,
                born: author.born,
                bookCount: count,
                id: author._id
        }
        }))
    }
    },

    Mutation: {
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })

        if (!user || args.password !== 'secreto') {
        throw new Error("credenciales incorrectas")
        }

        const userForToken = {
            username: user.username,
            id: user._id,
        }

        return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
    addBook: async (root, args) => {
        let author = await Author.findOne({ name: args.author })
        if (!author) {
            author = new Author({ name: args.author })
            await author.save()
        }
        const book = new Book({ ...args, author: author._id })
        await book.save()
        return book.populate('author')
    },
    editAuthor: async (root, args) => {
        const author = await Author.findOne({ name: args.name })
        if (!author) return null
        author.born = args.setBornTo
        return author.save()
    }
    }
}

module.exports = resolvers
```

Books.jsx:

```
import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = ({ books }) => {
    const [genre, setGenre] = useState(null)
    
    const booksToShow = genre 
        ? books.filter(b => b.genres.includes(genre))
        : books

    const genres = [...new Set(books.flatMap(b => b.genres))]

    return (
    <div>
        <h2>Books</h2>
        {genre && <p>in genre <b>{genre}</b></p>}
        
        <table>
            <tbody>
            <tr>
                <th></th>
                <th>author</th>
                <th>published</th>
            </tr>
            {booksToShow.map((b) => (
                <tr key={b.title}>
                <td>{b.title}</td>
                <td>{b.author?.name}</td>
                <td>{b.published}</td>
            </tr>
            ))}
        </tbody>
        </table>

        <div style={{ marginTop: '20px' }}>
        {genres.map(g => (
            <button key={g} onClick={() => setGenre(g)}>{g}</button>
        ))}
        <button onClick={() => setGenre(null)}>all genres</button>
        </div>
    </div>
    )
}

export default Books
```

App.jsx:

```
import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { ALL_BOOKS, ADD_BOOK } from './queries'
import Books from './components/Books'

const App = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const result = useQuery(ALL_BOOKS)
  
  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }]
  })

  if (result.loading) return <div>cargando...</div>

    if (result.error) {
    console.error('Error de Apollo:', result.error)
    return <div>Error al cargar los libros: {result.error.message}</div>
  }

  const submit = async (event) => {
    event.preventDefault()
    
    await addBook({ variables: { 
      title, author, published: parseInt(published), genres 
    }})

    setTitle('')
    setAuthor('')
    setPublished('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

    if (!result.data || !result.data.allBooks) {
    return <div>No hay libros disponibles.</div>
  }

  return (
    <div>
      <h1>Libros</h1>

      <h2>Agregar nuevo libro</h2>
      <form onSubmit={submit}>
        <div>título <input value={title} onChange={({target}) => setTitle(target.value)} /></div>
        <div>autor <input value={author} onChange={({target}) => setAuthor(target.value)} /></div>
        <div>publicado <input type="number" value={published} onChange={({target}) => setPublished(target.value)} /></div>
        <div>
          <input value={genre} onChange={({target}) => setGenre(target.value)} />
          <button onClick={addGenre} type="button">agregar género</button>
        </div>
        <div>géneros: {genres.join(' ')}</div>
        <button type="submit">crear libro</button>
      </form>

      <hr />

      <div>
        <Books books={result.data.allBooks} />
      </div>
    </div>
  )
}

export default App
```


## 23. Up-to-date cache and book recommendations: Asegurar que el frontend actualice su caché correctamente.

App.jsx:

```
import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { ALL_BOOKS, ADD_BOOK } from './queries'
import Books from './components/Books'

const App = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const result = useQuery(ALL_BOOKS)
  
  const [addBook] = useMutation(ADD_BOOK, {
  refetchQueries: [{ query: ALL_BOOKS }]
  })

  const submit = async (event) => {
    event.preventDefault()
    
    await addBook({ variables: { 
      title, author, published: parseInt(published), genres 
    }})

    setTitle('')
    setAuthor('')
    setPublished('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

    if (!result.data || !result.data.allBooks) {
    return <div>No hay libros disponibles.</div>
  }

  return (
    <div>
      <h1>Libros</h1>

      <h2>Agregar nuevo libro</h2>
      <form onSubmit={submit}>
        <div>título <input value={title} onChange={({target}) => setTitle(target.value)} /></div>
        <div>autor <input value={author} onChange={({target}) => setAuthor(target.value)} /></div>
        <div>publicado <input type="number" value={published} onChange={({target}) => setPublished(target.value)} /></div>
        <div>
          <input value={genre} onChange={({target}) => setGenre(target.value)} />
          <button onClick={addGenre} type="button">agregar género</button>
        </div>
        <div>géneros: {genres.join(' ')}</div>
        <button type="submit">crear libro</button>
      </form>

      <hr />

      <div>
        <Books books={result.data.allBooks} />
      </div>
    </div>
  )
}

export default App
```

## 24. Checkup: Verificación de integridad de la API.

Books.jsx:

```
import { useState } from 'react'

const Books = ({ books }) => {
    const [genre, setGenre] = useState(null)
    
    if (!books) return null 

    const booksToShow = genre 
        ? books.filter(b => b.genres.includes(genre))
        : books

    const genres = [...new Set(books.flatMap(b => b.genres))]

    return (
    <div>
        <h2>Books</h2>
        {genre && <p>in genre <b>{genre}</b></p>}
        
        <table>
            <tbody>
            <tr>
                <th></th>
                <th>author</th>
                <th>published</th>
            </tr>
            {booksToShow.map((b) => (
                <tr key={b.title}>
                    <td>{b.title}</td>
                    <td>{b.author?.name}</td>
                    <td>{b.published}</td>
            </tr>
            ))}
        </tbody>
        </table>

        <div style={{ marginTop: '20px' }}>
        {genres.map(g => (
            <button key={g} onClick={() => setGenre(g)}>{g}</button>
        ))}
        <button onClick={() => setGenre(null)}>all genres</button>
            </div>
        </div>
    )
}

export default Books
```

App.jsx:

```
import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { ALL_BOOKS, ADD_BOOK } from './queries'
import Books from './components/Books'

const App = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const result = useQuery(ALL_BOOKS)
  
  const [addBook] = useMutation(ADD_BOOK, {
  refetchQueries: [{ query: ALL_BOOKS }]
  })

  const submit = async (event) => {
    event.preventDefault()
    
    await addBook({ variables: { 
      title, author, published: parseInt(published), genres 
    }})

    setTitle('')
    setAuthor('')
    setPublished('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

    if (!result.data || !result.data.allBooks) {
    return <div>No hay libros disponibles.</div>
}

  return (
    <div>
      <h1>Libros</h1>

      <h2>Agregar nuevo libro</h2>
      <form onSubmit={submit}>
        <div>título <input value={title} onChange={({target}) => setTitle(target.value)} /></div>
        <div>autor <input value={author} onChange={({target}) => setAuthor(target.value)} /></div>
        <div>publicado <input type="number" value={published} onChange={({target}) => setPublished(target.value)} /></div>
        <div>
          <input value={genre} onChange={({target}) => setGenre(target.value)} />
          <button onClick={addGenre} type="button">agregar género</button>
        </div>
        <div>géneros: {genres.join(' ')}</div>
        <button type="submit">crear libro</button>
      </form>

      <hr />

      <div>
        <Books books={result.data.allBooks} />
      </div>
    </div>
  )
}

export default App
```



## 25. OPTIONAL: Subscriptions - server: Configurar el servidor para soportar WebSockets.

index.js:

```
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import http from 'http';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import typeDefs from './schema.js';
import resolvers from './resolvers.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);

async function startServer() {
    try {
        console.log('Conectando a MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Conectado a MongoDB exitosamente');
    } catch (error) {
        console.error('Error de conexión a MongoDB:', error.message);
        process.exit(1);
    }

    const app = express();
    const httpServer = http.createServer(app);

    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const wsServer = new WebSocketServer({
        server: httpServer,
    });

    const serverCleanup = useServer({ schema }, wsServer);

    const server = new ApolloServer({
        schema,
        plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
        async serverWillStart() {
            return {
                async drainServer() {
                await serverCleanup.dispose();
                    },
                };
            },
        },
    ],
});

    await server.start();

    app.use(cors(), express.json());

    app.use(
        '/graphql',
        cors(),
        express.json(),
        expressMiddleware(server, {
        context: async ({ req }) => ({ user: req.user }),
        })
    );

    const PORT = 4000;
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`🚀 Servidor listo en http://localhost:${PORT}/graphql`);
}

startServer();
```

author.js:

```
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4
    },
    born: {
        type: Number,
    },
});

export default mongoose.model('Author', schema);
```

books.js:

```
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 2
    },
    published: {
        type: Number,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    genres: [{ type: String }]
});

export default mongoose.model('Book', schema);
```

user.js:

```
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3
    }
});

export default mongoose.model('User', schema);
```

resolvers.js:

```
import Book from './models/book.js';
import Author from './models/author.js';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

const resolvers = {
    Query: {
        allBooks: async () => {
            console.log("¡El frontend está pidiendo libros!");
            return await Book.find({}).populate('author');
        },
        allAuthors: async () => {
            const authors = await Author.find({});
            return Promise.all(authors.map(async (author) => {
                const count = await Book.countDocuments({ author: author._id });
                return {
                    name: author.name,
                    born: author.born,
                    bookCount: count,
                    id: author._id
                };
            }));
        },
    },

    Mutation: {
        addBook: async (root, args) => {
            let author = await Author.findOne({ name: args.author });
            if (!author) {
                author = new Author({ name: args.author });
                await author.save();
            }
            const book = new Book({ ...args, author: author._id });
            await book.save();
            const savedBook = await book.populate('author');

            pubsub.publish('BOOK_ADDED', { bookAdded: savedBook });
            
            return savedBook;
        },
        
        editAuthor: async (root, args) => {
            const author = await Author.findOne({ name: args.name });
            if (!author) return null;
            author.born = args.setBornTo;
            return author.save();
        },
    },
    
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
        },
    },
};

export default resolvers;
```

schema.js:

```
import { gql } from 'graphql-tag';

const typeDefs = gql`
    type Book {
    title: String!
    author: Author!
    published: Int
    genres: [String]
    id: ID!
}

    type Author {
        name: String!
        born: Int
        bookCount: Int
        id: ID!
    }

    type Token {
        value: String!
    }

    type Query {
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]!
    }

    type Mutation {
        addBook(title: String!, author: String!, published: Int!, genres: [String!]!): Book
        editAuthor(name: String!, setBornTo: Int!): Author
        login(username: String!, password: String!): Token
    }

    type Subscription {
        bookAdded: Book!
    }
`

export default typeDefs;
```

main.jsx:

```
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, split } from '@apollo/client'
import './index.css'
import App from './App.jsx'

import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/graphql',
}))

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
```

App.jsx:

```
import { useQuery, useMutation, useSubscription, useApolloClient } from '@apollo/client'
import { useState } from 'react'
import { ALL_BOOKS, ADD_BOOK, BOOK_ADDED } from './queries'
import Books from './components/Books'

const App = () => {
  const client = useApolloClient()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const result = useQuery(ALL_BOOKS)
  
  const [addBook] = useMutation(ADD_BOOK, {
  refetchQueries: [{ query: ALL_BOOKS }]
  })

  const submit = async (event) => {
    event.preventDefault()
    
    await addBook({ variables: { 
      title, author, published: parseInt(published), genres 
    }})

    setTitle('')
    setAuthor('')
    setPublished('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  useSubscription(BOOK_ADDED, {
  onData: ({ data }) => {
    const addedBook = data.data.bookAdded
    alert(`${addedBook.title} agregado`)

    client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
      return {
        allBooks: allBooks.concat(addedBook),
      }
    })
  }
})

    if (!result.data || !result.data.allBooks) {
    return <div>No hay libros disponibles.</div>
}

  return (
    <div>
      <h1>Libros</h1>

      <h2>Agregar nuevo libro</h2>
      <form onSubmit={submit}>
        <div>título <input value={title} onChange={({target}) => setTitle(target.value)} /></div>
        <div>autor <input value={author} onChange={({target}) => setAuthor(target.value)} /></div>
        <div>publicado <input type="number" value={published} onChange={({target}) => setPublished(target.value)} /></div>
        <div>
          <input value={genre} onChange={({target}) => setGenre(target.value)} />
          <button onClick={addGenre} type="button">agregar género</button>
        </div>
        <div>géneros: {genres.join(' ')}</div>
        <button type="submit">crear libro</button>
      </form>

      <hr />

      <div>
        <Books books={result.data.allBooks} />
      </div>
    </div>
  )
}

export default App
```


## Ejercicios de Frontend y Optimización

## 26 - 27. OPTIONAL: Subscriptions - client (parte 1 y 2): Conectar tu aplicación React mediante GraphQLWsLink para escuchar cambios en tiempo real.

main.jsx:

```
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
})

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000/graphql',
  })
)

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink,
)

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
)
```

index.js:

```
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import http from 'http';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import typeDefs from './schema.js';
import resolvers from './resolvers.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);

async function startServer() {
    try {
        console.log('Conectando a MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Conectado a MongoDB exitosamente');
    } catch (error) {
        console.error('Error de conexión a MongoDB:', error.message);
        process.exit(1);
    }

    const app = express();
    const httpServer = http.createServer(app);

    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });

    const serverCleanup = useServer({ schema }, wsServer);

    const server = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });

    await server.start();

    app.use(cors());
    app.use(express.json());

    app.use(
        '/graphql',
        expressMiddleware(server, {
            context: async ({ req }) => ({ user: req?.user }),
        })
    );

    const PORT = 4000;
    
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`🚀 Servidor listo en http://localhost:${PORT}/graphql`);
}

startServer();
```

queries.jsx:

```
import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
            born
            bookCount
        }
    }
`

export const ALL_BOOKS = gql`
    query allBooks($genre: String) {
        allBooks(genre: $genre) {
            title
            published
            genres
            author {
                name
            }
        }
    }
`

export const ADD_BOOK = gql`
    mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
        addBook(title: $title, author: $author, published: $published, genres: $genres) {
            title
            published
            genres
            author {
                name
            }
        }
    }
`

export const EDIT_AUTHOR = gql`
    mutation editAuthor($name: String!, $setBornTo: Int!) {
        editAuthor(name: $name, setBornTo: $setBornTo) {
            name
            born
        }
    }
`

export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            value
        }
    }
`

export const BOOK_ADDED = gql`
    subscription {
        bookAdded {
            title
            published
            author {
                name
            }
            genres
        }
    }
`
```

NewBook.jsx:

```
import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_BOOK } from '../queries'

const NewBook = () => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [published, setPublished] = useState('')
    const [genre, setGenre] = useState('')
    const [genres, setGenres] = useState([])

    const [createBook] = useMutation(ADD_BOOK, {
        onError: (error) => {
            console.log(error)
        }
    })

    const submit = async (event) => {
        event.preventDefault()

        await createBook({
            variables: { 
                title, 
                author, 
                published: parseInt(published), 
                genres 
            }
        })

        setTitle('')
        setAuthor('')
        setPublished('')
        setGenres([])
    }

    const addGenre = () => {
        setGenres(genres.concat(genre))
        setGenre('')
    }

    return (
    <div>
        <h2>Añadir libro</h2>
        <form onSubmit={submit}>
            <div>
                título:
                <input
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>
            <div>
                autor:
                <input
                    value={author}
                    onChange={({ target }) => setAuthor(target.value)}
                />
            </div>
            <div>
                publicado:
                <input
                    type="number"
                    value={published}
                    onChange={({ target }) => setPublished(target.value)}
                />
            </div>
            <div>
                <input
                    value={genre}
                    onChange={({ target }) => setGenre(target.value)}
                />
                <button type="button" onClick={addGenre}>
                    añadir género
                </button>
            </div>
            <div>géneros: {genres.join(', ')}</div>
            <button type="submit">crear libro</button>
        </form>
    </div>
    )
}

export default NewBook
```

App.jsx:

```
import { useState } from 'react'
import { useQuery, useSubscription } from '@apollo/client'
import { ALL_BOOKS, BOOK_ADDED } from './queries'
import NewBook from './components/NewBook'

const updateCache = (cache, query, addedBook) => {
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [page, setPage] = useState('books')
  const { data, loading, error } = useQuery(ALL_BOOKS)

  useSubscription(BOOK_ADDED, {
    onData: ({ client, data }) => {
      const addedBook = data.data.bookAdded
      window.alert(`¡Nuevo libro agregado: ${addedBook.title}!`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    },
  })

  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error al cargar los datos</div>

  return (
    <div>
      <div>
        <button onClick={() => setPage('books')}>libros</button>
        <button onClick={() => setPage('add')}>agregar libro</button>
      </div>

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

      {/* 2. Renderizas el componente aquí cuando la página sea 'add' */}
      {page === 'add' && <NewBook />}
    </div>
  )
}

export default App
```


## 28. OPTIONAL: n+1: Identificar y optimizar consultas ineficientes a la base de datos (usando técnicas de populate o DataLoader).

resolvers.js:

```
import Book from './models/book.js';
import Author from './models/author.js';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

const resolvers = {
    Query: {
        allBooks: async (root, args) => {
            let query = Book.find({});
            if (args.genre) {
                query = query.find({ genres: { $in: [args.genre] } });
            }
            return query;
        },
        allAuthors: async () => {
            return Author.find({});
        },
    },

    Book: {
        author: async (root, args, context) => {
            return context.authorLoader.load(root.author);
        },
    },

    Mutation: {
        addBook: async (root, args, context) => {
            let author = await Author.findOne({ name: args.author });
            if (!author) {
                author = new Author({ name: args.author });
                await author.save();
            }
            const book = new Book({ ...args, author: author._id });
            await book.save();
            
            const savedBook = book.toObject();
            savedBook.author = author;

            pubsub.publish('BOOK_ADDED', { bookAdded: savedBook });
            
            return savedBook;
        },
        
        editAuthor: async (root, args) => {
            const author = await Author.findOne({ name: args.name });
            if (!author) return null;
            author.born = args.setBornTo;
            return author.save();
        },
    },
    
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
        },
    },
};

export default resolvers;
```

author.js:

```
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4
    },
    born: {
        type: Number,
    },
});

export default mongoose.model('Author', schema);
```

schema.js:

```
import { gql } from 'graphql-tag';

const typeDefs = gql`
    type Book {
    title: String!
    author: Author
    published: Int
    genres: [String]
    id: ID!
}

    type Author {
        name: String!
        born: Int
        bookCount: Int
        id: ID!
    }

    type Token {
        value: String!
    }

    type Query {
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]!
    }

    type Mutation {
        addBook(title: String!, author: String!, published: Int!, genres: [String!]!): Book
        editAuthor(name: String!, setBornTo: Int!): Author
        login(username: String!, password: String!): Token
    }

    type Subscription {
        bookAdded: Book!
    }
`

export default typeDefs;
```

loader.js:

```
import DataLoader from 'dataloader'
import Author from './models/author.js'

const batchAuthors = async (authorIds) => {
    const authors = await Author.find({ _id: { $in: authorIds } })
    const authorMap = authors.reduce((acc, author) => {
        acc[author._id.toString()] = author
        return acc
    }, {})
    
    return authorIds.map(authorId => authorMap[authorId.toString()])
}

export const createAuthorLoader = () => new DataLoader(batchAuthors)
```

NewBook.jsx:

```
import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_BOOK, ALL_BOOKS } from '../queries'

const NewBook = () => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [published, setPublished] = useState('')
    const [genre, setGenre] = useState('')
    const [genres, setGenres] = useState([])

    const [createBook] = useMutation(ADD_BOOK, {
        refetchQueries: [{ query: ALL_BOOKS }],
        onError: (error) => {
            console.log(error.graphQLErrors[0]?.message);
        }
    })

    const submit = async (event) => {
        event.preventDefault()

        await createBook({
            variables: { 
                title, 
                author, 
                published: parseInt(published), 
                genres 
            }
        })

        setTitle('')
        setAuthor('')
        setPublished('')
        setGenres([])
    }

    const addGenre = () => {
        setGenres(genres.concat(genre))
        setGenre('')
    }

    return (
    <div>
        <h2>Añadir libro</h2>
        <form onSubmit={submit}>
            <div>
                título:
                <input
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>
            <div>
                autor:
                <input
                    value={author}
                    onChange={({ target }) => setAuthor(target.value)}
                />
            </div>
            <div>
                publicado:
                <input
                    type="text"
                    value={published}
                    onChange={({ target }) => setPublished(target.value)}
                />
            </div>
            <div>
                <input
                    value={genre}
                    onChange={({ target }) => setGenre(target.value)}
                />
                <button type="button" onClick={addGenre}>
                    añadir género
                </button>
            </div>
            <div>géneros: {genres.join(', ')}</div>
            <button type="submit">crear libro</button>
        </form>
    </div>
    )
}

export default NewBook
```


## 29. Your GitHub repository: La entrega final de tu código.

Incluir login con usuario y clave:

LoginForm.jsx:

```
import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ setToken, setError, page }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [login, { result }] = useMutation(LOGIN, {
        onError: (error) => {
            setError(error.graphQLErrors[0].message)
        }
    })

    useEffect(() => {
        if (result && result.data) {
            const token = result.data.login.value
            setToken(token)
            localStorage.setItem('library-user-token', token)
        }
    }, [result])

    if (page !== 'login') {
        return null
    }

    const submit = async (event) => {
        event.preventDefault()
        console.log("Intentando iniciar sesión con:", username, password)
        
        try {
            const result = await login({ variables: { username, password } })
            console.log("Resultado crudo del servidor:", result)
            
            if (result && result.data && result.data.login) {
                const token = result.data.login.value || result.data.login 
                
                setToken(token)
                localStorage.setItem('library-user-token', token)
            } else {
                console.error("El servidor devolvió data.login nulo:", result)
            }
        } catch (error) {
            console.error("Error en la mutación:", error)
        }
}
    return (
    <div>
        <form onSubmit={submit}>
        <div>
            username <input
                type='text'
                value={username}
                onChange={({ target }) => setUsername(target.value)}
            />
        </div>
        <div>
            password <input
                type='password'
                value={password}
                onChange={({ target }) => setPassword(target.value)}
            />
        </div>
        <button type='submit'>login</button>
        </form>
    </div>
    )
}

export default LoginForm
```

user.js:

```
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3
    },
    passwordHash: {
        type: String,
        required: true
    }
});

export default mongoose.model('User', schema);
```

resolvers.js:

```
import Book from './models/book.js';
import Author from './models/author.js';
import User from './models/user.js';
import bcrypt from 'bcrypt';         
import jwt from 'jsonwebtoken';    
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

const resolvers = {
    Query: {
        allBooks: async (root, args) => {
            let query = Book.find({});
            if (args.genre) {
                query = query.find({ genres: { $in: [args.genre] } });
            }
            return query;
        },
        allAuthors: async () => {
            return Author.find({});
        },
    },

    Book: {
        author: async (root, args, context) => {
            return context.authorLoader.load(root.author);
        },
    },

    Mutation: {
        addBook: async (root, args, context) => {
            let author = await Author.findOne({ name: args.author });
            if (!author) {
                author = new Author({ name: args.author });
                await author.save();
            }
            const book = new Book({ ...args, author: author._id });
            await book.save();
            
            const savedBook = book.toObject();
            savedBook.author = author;

            pubsub.publish('BOOK_ADDED', { bookAdded: savedBook });
            
            return savedBook;
        },
        
        editAuthor: async (root, args) => {
            const author = await Author.findOne({ name: args.name });
            if (!author) return null;
            author.born = args.setBornTo;
            return author.save();
        },

        login: async (root, args) => {
            const user = await User.findOne({ username: args.username });
            const passwordCorrect = user === null
                ? false
                : await bcrypt.compare(args.password, user.passwordHash);

            if (!(user && passwordCorrect)) {
                throw new Error("credenciales inválidas");
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            };
            return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
        },
    },
    
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
        },
    },
};

export default resolvers;
```

index.js:

```
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import http from 'http';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import typeDefs from './schema.js';
import resolvers from './resolvers.js';
import { createAuthorLoader } from './loader.js';
import jwt from 'jsonwebtoken';
import User from './models/user.js';
import bcrypt from 'bcrypt';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);

async function startServer() {
    try {
        console.log('Conectando a MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Conectado a MongoDB exitosamente');

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (adminUsername && adminPassword) {
            const existingUser = await User.findOne({ username: adminUsername });
            if (!existingUser) {
                const saltRounds = 10;
                const passwordHash = await bcrypt.hash(adminPassword, saltRounds);
                
                const newUser = new User({
                    username: adminUsername,
                    passwordHash,
                });

                await newUser.save();
                console.log(`Usuario administrador '${adminUsername}' creado automáticamente.`);
            }
        }

    } catch (error) {
        console.error('Error de conexión a MongoDB:', error.message);
        process.exit(1);
    }

    const app = express();
    const httpServer = http.createServer(app);

    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });

    const serverCleanup = useServer({ schema }, wsServer);

    const server = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });

    await server.start();

    app.use(cors());
    app.use(express.json());

    app.use(
        '/graphql',
        expressMiddleware(server, {
            context: async ({ req }) => {
                const auth = req ? req.headers.authorization : null;
                let currentUser = null;

                if (auth && auth.startsWith('Bearer ')) {
                    try {
                        const decodedToken = jwt.verify(
                            auth.substring(7), 
                            process.env.JWT_SECRET
                        );
                        currentUser = await User.findById(decodedToken.id);
                    } catch (error) {
                    }
                }

                return {
                    user: currentUser,
                    authorLoader: createAuthorLoader(),
                };
            },
        })
    );

    const PORT = 4000;
    
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`🚀 Servidor listo en http://localhost:${PORT}/graphql`);
}

startServer();
```

main.jsx:

```
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, split } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('library-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
})

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000/graphql',
  })
)

const authHttpLink = authLink.concat(httpLink)

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authHttpLink,
)

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
)
```

App.jsx:

```
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
```


## En resumen: La "tarea" principal ahora mismo es conectar el servidor de libros con el frontend, implementar el login para proteger las 
## mutaciones (como añadir libros) y, lograr que la lista de libros se actualice sola usando suscripciones. 

## FIN