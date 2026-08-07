## Parte 6
## Tarea Ejercicio 6.1. Unicafe revisitado
* Uso de Zustand para no tener intermediarios entre archivos (simplifica la comunicación)

App.jsx:

```
import Buttons from './components/Buttons'
import Statistics from './components/Statistics'

const App = () => {
  return (
    <div>
      <h1>give feedback</h1>
      <Buttons />
      <Statistics />
    </div>
  )
}

export default App
```

store.js:

```
import { create } from 'zustand'

export const useUnicafeStore = create((set) => ({
    good: 0,
    neutral: 0,
    bad: 0,
    incrementGood: () => set((state) => ({ good: state.good + 1 })),
    incrementNeutral: () => set((state) => ({ neutral: state.neutral + 1 })),
    incrementBad: () => set((state) => ({ bad: state.bad + 1 })),
}))
```

Buttons.jsx:

```
import { useUnicafeStore } from '../store'

const Buttons = () => {
  const incrementGood = useUnicafeStore((state) => state.incrementGood)
  const incrementNeutral = useUnicafeStore((state) => state.incrementNeutral)
  const incrementBad = useUnicafeStore((state) => state.incrementBad)

  return (
    <div>
      <button onClick={incrementGood}>good</button>
      <button onClick={incrementNeutral}>neutral</button>
      <button onClick={incrementBad}>bad</button>
    </div>
  )
}
export default Buttons
```

Statistics.jsx:

```
import { useUnicafeStore } from '../store'

const Statistics = () => {
  const { good, neutral, bad } = useUnicafeStore()
  const all = good + neutral + bad
  const average = all === 0 ? 0 : (good - bad) / all
  const positive = all === 0 ? 0 : (good / all) * 100

  return (
    <div>
      <h2>statistics</h2>
      {all === 0 ? (
        <p>No feedback given</p>
      ) : (
        <table>
          <tbody>
            <tr><td>good</td><td>{good}</td></tr>
            <tr><td>neutral</td><td>{neutral}</td></tr>
            <tr><td>bad</td><td>{bad}</td></tr>
            <tr><td>all</td><td>{all}</td></tr>
            <tr><td>average</td><td>{average.toFixed(1)}</td></tr>
            <tr><td>positive</td><td>{positive.toFixed(1)} %</td></tr>
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Statistics
```

## Tarea 6.2: Anécdotas, Paso 1

store.js:

```
import { create } from 'zustand'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = anecdote => ({
  content: anecdote,
  id: getId(),
  votes: 0
})

const useAnecdoteStore = create((set) => ({
  anecdotes: anecdotesAtStart.map(asObject),
  
  // Definimos las acciones aquí
  actions: {
    vote: (id) => set((state) => ({
      anecdotes: state.anecdotes.map(anec =>
        anec.id !== id ? anec : { ...anec, votes: anec.votes + 1 }
      )
    }))
  }
}))

// Hooks personalizados para acceder al estado y a las acciones
export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
```

App.jsx:

```
import { useAnecdotes, useAnecdoteActions } from './store'

const App = () => {
  const anecdotes = useAnecdotes()
  const { vote } = useAnecdoteActions() 

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
      
      <h2>create new</h2>
      <form>
        <div>
          <input />
        </div>
        <button>create</button>
      </form>
    </div>
  )
}

export default App
```

## Tarea 6.3: Anécdotas, Paso 2

store.js:

```
import { create } from 'zustand'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = anecdote => ({
  content: anecdote,
  id: getId(),
  votes: 0
})

const useAnecdoteStore = create((set) => ({
  anecdotes: anecdotesAtStart.map(asObject),
  
  actions: {
    vote: (id) => set((state) => ({
      anecdotes: state.anecdotes.map(anec =>
        anec.id !== id ? anec : { ...anec, votes: anec.votes + 1 }
      )
    })),
    // Nueva acción para crear
    create: (content) => set((state) => ({
      anecdotes: [...state.anecdotes, asObject(content)]
    }))
  }
}))

// Hooks personalizados para acceder al estado y a las acciones
export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
```

App.jsx:

```
import { useAnecdotes, useAnecdoteActions } from './store'

const App = () => {
  const anecdotes = useAnecdotes()
  const { vote, create } = useAnecdoteActions() // Importamos create

  const addAnecdote = (event) => {
    event.preventDefault() // Evita que la página se recargue al enviar
    const content = event.target.anecdote.value // Accedemos al valor del input por su atributo "name"
    event.target.anecdote.value = '' // Limpiamos el input después de enviar
    create(content) // Llamamos a la acción del store
  } 

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
      
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          {/* El atributo "name" es clave aquí para event.target.anecdote.value */}
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default App
```

## Tarea 6.4: Anécdotas, Paso 3

AnecdoteList.jsx:

```
import { useAnecdotes, useAnecdoteActions } from '../store'

const AnecdoteList = () => {
    const anecdotes = useAnecdotes()
    const { vote } = useAnecdoteActions()

    return (
    <div>
        {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
        </div>
        ))}
    </div>
    )
}

export default AnecdoteList
```

AnecdoteForm.jsx:

```
import { useAnecdoteActions } from '../store'

const AnecdoteForm = () => {
    const { create } = useAnecdoteActions()

    const addAnecdote = (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
            create(content)
    }

    return (
    <div>
        <h2>create new</h2>
        <form onSubmit={addAnecdote}>
        <div><input name="anecdote" /></div>
        <button type="submit">create</button>
        </form>
    </div>
    )
}

export default AnecdoteForm
```

App.jsx:

```
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App
```


## Tarea 6.5: Anécdotas, Paso 4

AnecdoteList.jsx:

```
import { useAnecdotes, useAnecdoteActions } from '../store'

const AnecdoteList = () => {
    const anecdotes = useAnecdotes()
    const { vote } = useAnecdoteActions()

    const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

    return (
    <div>
      {/* 2. Iniciamos el mapeo aquí */}
        {sortedAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
        </div>
        ))}
      {/* 3. El mapeo termina justo antes de cerrar el div principal */}
    </div>
    )
}

export default AnecdoteList
```

Anecdote.Form.jsx:

```
import { useAnecdoteActions } from '../store'

const AnecdoteForm = () => {
    const { create } = useAnecdoteActions()

    const addAnecdote = (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
            create(content)
    }

    return (
    <div>
        <h2>create new</h2>
        <form onSubmit={addAnecdote}>
        <div><input name="anecdote" /></div>
        <button type="submit">create</button>
        </form>
    </div>
    )
}

export default AnecdoteForm
```

App.jsx:

```
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'


const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteList />
      <AnecdoteForm />
      
    </div>
  )
}

export default App
```

store.js:

```
import { create } from 'zustand'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = anecdote => ({
  content: anecdote,
  id: getId(),
  votes: 0
})

const useAnecdoteStore = create((set) => ({
  anecdotes: anecdotesAtStart.map(asObject),
  
  actions: {
    vote: (id) => set((state) => ({
  anecdotes: state.anecdotes.map((anec) => {
    if (anec.id === id) {
      console.log("Votando por:", anec.content, "con ID:", anec.id);
      return { ...anec, votes: anec.votes + 1 };
    }
    return anec;
  })
})),
    // Nueva acción para crear
    create: (content) => set((state) => ({
      anecdotes: [...state.anecdotes, asObject(content)]
    }))
  }
}))

// Hooks personalizados para acceder al estado y a las acciones
export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
```

## 6.6 Anécdotas, Paso 5

store.js:

```
import { create } from 'zustand'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)
const asObject = anecdote => ({
  content: anecdote,
  id: getId(),
  votes: 0
})

const useAnecdoteStore = create((set) => ({
  anecdotes: anecdotesAtStart.map(asObject),
  filter: '', 
  actions: {
    vote: (id) => set((state) => ({
      anecdotes: state.anecdotes.map((anec) => 
        anec.id === id ? { ...anec, votes: anec.votes + 1 } : anec
      )
    })),
    create: (content) => set((state) => ({
      anecdotes: [...state.anecdotes, asObject(content)]
    })),
    setFilter: (value) => set({ filter: value })
  }
}))

// Hooks exportados (estos son los únicos que necesitas)
export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)
export const useFilter = () => useAnecdoteStore(state => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore(state => state.actions)

export const useVisibleAnecdotes = () => {
  const anecdotes = useAnecdoteStore(state => state.anecdotes)
  const filter = useAnecdoteStore(state => state.filter)

  return anecdotes.filter(a => 
    a.content.toLowerCase().includes(filter.toLowerCase())
  )
}
```

Filter.js:

```
// components/Filter.js
import { useAnecdoteActions } from '../store'

const Filter = () => {
    const { setFilter } = useAnecdoteActions()

    const handleChange = (event) => {
    // Esto actualizará el estado global en el store
    setFilter(event.target.value)
    }

    const style = { marginBottom: 10 }

    return (
    <div style={style}>
        filter <input onChange={handleChange} />
    </div>
    )
}
export default Filter
```

AnecdoteList.jsx:

```
import { useVisibleAnecdotes, useAnecdoteActions } from '../store'

const AnecdoteList = () => {
  // Usamos tu hook que ya filtra los datos
  const anecdotes = useVisibleAnecdotes() 
  const { vote } = useAnecdoteActions()

  // Ordenamos las anécdotas por votos de mayor a menor
  // Usamos [...anecdotes] para crear una copia y no mutar el estado original
  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

  return (
    <ul>
      {sortedAnecdotes.map(anecdote => (
        <li key={anecdote.id}>
          {anecdote.content} <br />
          has {anecdote.votes}
          <button onClick={() => vote(anecdote.id)}>vote</button>
        </li>
      ))}
    </ul>
  )
}

export default AnecdoteList
```

App.jsx:

```
// src/App.js
import Filter from './components/Filter'
import AnecdoteForm from './components/AnecdoteForm' // Asegúrate de tener este también
import AnecdoteList from './components/AnecdoteList'

const App = () => {
  return (
    <div>
      <h1>Software anecdotes</h1>
      <Filter />
      <AnecdoteForm />
      <AnecdoteList />
    </div>
  )
}
export default App
```

## Tarea 6.7 Anécdotas, Paso 6

backend/db.json (con 
PS C:\...\fullstackopen2026-AH\part6\backend> npx json-server --port 3001 --watch db.json):

```
{
    "anecdotes": [
    {
        "content": "If it hurts, do it more often",
        "id": "47145",
        "votes": 0
    },
    {
        "content": "Adding manpower to a late software project makes it later!",
        "id": "21149",
        "votes": 0
    },
    {
        "content": "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
        "id": "69581",
        "votes": 0
    },
    {
        "content": "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
        "id": "36975",
        "votes": 0
    },
    {
        "content": "Premature optimization is the root of all evil.",
        "id": "25170",
        "votes": 0
    },
    {
        "content": "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
        "id": "98312",
        "votes": 0
    }
    ]
}
```

anecdotes.js:
```
const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response = await fetch(baseUrl)
    return response.json()
}

export default { getAll }
```

frontend with npm run dev:
App.jsx:

```
import { useEffect } from 'react'
import { useAnecdoteActions } from './store'
import AnecdoteList from './components/AnecdoteList'

const App = () => {
  const { initialize } = useAnecdoteActions()

  useEffect(() => {
    initialize() // Esto descarga los datos del servidor al cargar la app
  }, [initialize])

  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteList />
    </div>
  )
}

export default App
```

store.js:

```
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '', 
  actions: {
    initialize: async () => {
      const data = await anecdoteService.getAll()
      set({ anecdotes: data })
    },
    vote: (id) => set((state) => ({
      anecdotes: state.anecdotes.map((anec) => 
        anec.id === id ? { ...anec, votes: anec.votes + 1 } : anec
      )
    })),
    create: (content) => set((state) => ({
      
      anecdotes: [...state.anecdotes, { content, id: (100000 * Math.random()).toFixed(0), votes: 0 }]
    })),
    setFilter: (value) => set({ filter: value })
  }
}))

// Hooks exportados
export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)
export const useFilter = () => useAnecdoteStore(state => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore(state => state.actions)

export const useVisibleAnecdotes = () => {
  const anecdotes = useAnecdoteStore(state => state.anecdotes)
  const filter = useAnecdoteStore(state => state.filter)

  return anecdotes.filter(a => 
    a.content.toLowerCase().includes(filter.toLowerCase())
  )
}
```

AnecdoteList.jsx:

```
import { useVisibleAnecdotes, useAnecdoteActions } from '../store'

const AnecdoteList = () => {
  const anecdotes = useVisibleAnecdotes()
  const { vote } = useAnecdoteActions()

  return (
    <ul>
      {anecdotes.map(anecdote => (
        <li key={anecdote.id}>
          {anecdote.content} <br />
          has {anecdote.votes}
          <button onClick={() => vote(anecdote.id)}>vote</button>
        </li>
      ))}
    </ul>
  )
}

export default AnecdoteList
```

## Tarea 6.8 Anécdotas, Paso 7
con backend/db.json (es el mismo que lo anterior):
en frontend, tenemos:

anecdotes.js:

```
// src/services/anecdotes.js
const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response = await fetch(baseUrl)
    return response.json()
}

const createNew = async (content) => {
    const object = { content, votes: 0 }
    const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(object)
    })
    return response.json()
}

const updateVotes = async (anecdote) => {
    const updated = { ...anecdote, votes: anecdote.votes + 1 }
    const response = await fetch(`${baseUrl}/${anecdote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ votes: updated.votes })
    })
    return response.json()
}

export default { getAll, createNew }
```

store.js:

```
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '', 
  actions: {
    initialize: async () => {
      const data = await anecdoteService.getAll()
      set({ anecdotes: data })
    },
    vote: (id) => set((state) => ({
      anecdotes: state.anecdotes.map((anec) => 
        anec.id === id ? { ...anec, votes: anec.votes + 1 } : anec
      )
    })),
    create: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)
      set((state) => ({
        anecdotes: [...state.anecdotes, newAnecdote]
      }))
    },
    setFilter: (value) => set({ filter: value })
  }
}))

// Hooks exportados
export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)
export const useFilter = () => useAnecdoteStore(state => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore(state => state.actions)

export const useVisibleAnecdotes = () => {
  const anecdotes = useAnecdoteStore(state => state.anecdotes)
  const filter = useAnecdoteStore(state => state.filter)

  return anecdotes.filter(a => 
    a.content.toLowerCase().includes(filter.toLowerCase())
  )
}
```

AnecdoteList,jsx:

```
import { useVisibleAnecdotes, useAnecdoteActions, useFilter } from '../store'

const AnecdoteList = () => {
  const anecdotes = useVisibleAnecdotes()
  const filter = useFilter()
  const { vote } = useAnecdoteActions()

  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

  return (
    <ul>
      {sortedAnecdotes.map(anecdote => (
        <li key={anecdote.id}>
          {anecdote.content} <br />
          has {anecdote.votes}
          <button onClick={() => vote(anecdote.id)}>vote</button>
        </li>
      ))}
    </ul>
  )
}

export default AnecdoteList
```

App.jsx:

```
import { useEffect } from 'react'
import { useAnecdoteActions } from './store'
import AnecdoteList from './components/AnecdoteList'

const App = () => {
  const { initialize } = useAnecdoteActions()

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteList />
    </div>
  )
}

export default App
```

## Tarea 6.9 Anécdotas, Paso 8
Ahora la votación queda guardada en la db.json.

```
{
  "anecdotes": [
    {
      "content": "If it hurts, do it more often",
      "id": "47145",
      "votes": 2
    },
    {
      "content": "Adding manpower to a late software project makes it later!",
      "id": "21149",
      "votes": 12
    },
    {
      "content": "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
      "id": "69581",
      "votes": 3
    },
    {
      "content": "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
      "id": "36975",
      "votes": 5
    },
    {
      "content": "Premature optimization is the root of all evil.",
      "id": "25170",
      "votes": 0
    },
    {
      "content": "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
      "id": "98312",
      "votes": 1
    }
  ],
  "$schema": "./node_modules/json-server/schema.json"
}
```

anecdotes.js

```
// src/services/anecdotes.js
const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response = await fetch(baseUrl)
    return response.json()
}

const createNew = async (content) => {
    const object = { content, votes: 0 }
    const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(object)
    })
    return response.json()
}

const updateVotes = async (anecdote) => {
    const updated = { ...anecdote, votes: anecdote.votes + 1 }
    const response = await fetch(`${baseUrl}/${anecdote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ votes: updated.votes })
    })
    return response.json()
}

export default { getAll, createNew, updateVotes }
```

store.js

```
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '', 
  actions: {
    initialize: async () => {
      const data = await anecdoteService.getAll()
      set({ anecdotes: data })
    },
    vote: async (id) => {
      const state = useAnecdoteStore.getState()
      const anecdoteToVote = state.anecdotes.find(a => a.id === id)
      const updatedAnecdote = await anecdoteService.updateVotes(anecdoteToVote)

      set((state) => ({
        anecdotes: state.anecdotes.map((anec) => 
          anec.id === id ? updatedAnecdote : anec
        )
      }))
    },
    setFilter: (value) => set({ filter: value })
  }
}))

export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)
export const useFilter = () => useAnecdoteStore(state => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore(state => state.actions)

export const useVisibleAnecdotes = () => {
  const anecdotes = useAnecdoteStore(state => state.anecdotes)
  const filter = useAnecdoteStore(state => state.filter)

  return anecdotes.filter(a => 
    a.content.toLowerCase().includes(filter.toLowerCase())
  )
}
```

## Tarea 6.10 Anécdotas, Paso 9

notificationStore.js:

```
import { create } from 'zustand'

const useNotificationStore = create((set) => ({
    message: null,
    setNotification: (msg, seconds) => {
        set({ message: msg })
        setTimeout(() => {
            set({ message: null })
    }, seconds * 1000)
    }
}))

export const useNotificationMessage = () => useNotificationStore(state => state.message)

// SOLUCIÓN: Seleccionar solo la función que se necesita, sin crear un objeto nuevo
export const useNotificationActions = () => useNotificationStore(state => state.setNotification)
```

AnecdoteList.jsx:

```
import { useVisibleAnecdotes, useAnecdoteActions } from '../store'

const AnecdoteList = () => {
  const anecdotes = useVisibleAnecdotes() // Este ya hace el .filter() automáticamente
  const { vote } = useAnecdoteActions()

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList
```

Filter.jsx:

```
import { useAnecdoteActions } from '../store'

const Filter = () => {
    const { setFilter } = useAnecdoteActions()

    const handleChange = (event) => {
        setFilter(event.target.value) // Actualiza el filtro en el store
    }

    return (
    <div>
        filter <input onChange={handleChange} />
    </div>
    )
}

export default Filter
```

Notification.jsx:

```
import { useNotificationMessage } from '../notificationStore'

const Notification = () => {
  const message = useNotificationMessage()
  
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  if (message === null) return null

  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default Notification
```

AnecdoteForm.jsx:

```
import { useAnecdoteActions } from '../store'
import { useNotificationActions } from '../notificationStore'

const AnecdoteForm = () => {
    const { create } = useAnecdoteActions()
    const setNotification = useNotificationActions()

    // src/components/AnecdoteForm.jsx
const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    
    await create(content) // Esta acción debe hacer el POST al backend
    setNotification(`You created '${content}'`, 5)
}

    return (
    <form onSubmit={addAnecdote}>
        <input name="anecdote" />
        <button type="submit">create</button>
    </form>
    )
}

export default AnecdoteForm
```

App.jsx:

```
import { useEffect } from 'react'
import { useAnecdoteActions } from './store'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'
import Filter from './components/Filter'

const App = () => {
  const { initialize } = useAnecdoteActions()

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter /> {/* Ahora React sabrá qué es este componente */}
      <AnecdoteList />
      <AnecdoteForm /> 
    </div>
  )
}

export default App
```

## Tarea 6.11 Anécdotas, Paso 10

store.js:

```
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '', 
  actions: {
    initialize: async () => {
      const data = await anecdoteService.getAll()
      set({ anecdotes: data })
    },
    vote: async (id) => {
      const state = useAnecdoteStore.getState()
      const anecdoteToVote = state.anecdotes.find(a => a.id === id)
      const updatedAnecdote = await anecdoteService.updateVotes(anecdoteToVote)

      set((state) => ({
        anecdotes: state.anecdotes.map((anec) => 
          anec.id === id ? updatedAnecdote : anec
        )
      }))
    },
    // Ahora 'remove' está correctamente dentro del objeto 'actions'
    remove: async (id) => {
      await anecdoteService.remove(id)
      set((state) => ({
        anecdotes: state.anecdotes.filter(a => a.id !== id)
      }))
    },
    setFilter: (value) => set({ filter: value })
  }
}))

export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)
export const useFilter = () => useAnecdoteStore(state => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore(state => state.actions)

export const useVisibleAnecdotes = () => {
  const anecdotes = useAnecdoteStore(state => state.anecdotes)
  const filter = useAnecdoteStore(state => state.filter)

  return anecdotes.filter(a => 
    a.content.toLowerCase().includes(filter.toLowerCase())
  )
}
```

anecdotes.js:

```
import axios from 'axios'
const baseUrl = 'http://localhost:3001/anecdotes'

const remove = async (id) => {
    const response = await axios.delete(`${baseUrl}/${id}`)
    return response.data
}

const getAll = async () => {
    const response = await fetch(baseUrl)
    return response.json()
}

const createNew = async (content) => {
    const object = { content, votes: 0 }
    const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(object)
    })
    return response.json()
}

const updateVotes = async (anecdote) => {
    const updated = { ...anecdote, votes: anecdote.votes + 1 }
    const response = await fetch(`${baseUrl}/${anecdote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ votes: updated.votes })
    })
    return response.json()
}

export default { getAll, createNew, updateVotes, remove }
```

AnecdoteList.jsx:

```
import { useVisibleAnecdotes, useAnecdoteActions } from '../store'
import { useNotificationActions } from '../notificationStore'

const AnecdoteList = () => {
  const anecdotes = useVisibleAnecdotes()
  const { vote, remove } = useAnecdoteActions()
  const setNotification = useNotificationActions()

  const handleDelete = (anecdote) => {
    if (window.confirm(`Delete '${anecdote.content}'?`)) {
      remove(anecdote.id)
      setNotification(`Deleted '${anecdote.content}'`, 5)
    }
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
            <button onClick={() => handleDelete(anecdote)}>delete</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList
```


## Tarea 6.12 Anécdotas, Paso 11

```
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '', 
  actions: {
    initialize: async () => {
      const data = await anecdoteService.getAll()
      set({ anecdotes: data })
    },
    vote: async (id) => {
      const state = useAnecdoteStore.getState()
      const anecdoteToVote = state.anecdotes.find(a => a.id === id)
      const updatedAnecdote = await anecdoteService.updateVotes(anecdoteToVote)

      set((state) => ({
        anecdotes: state.anecdotes.map((anec) => 
          anec.id === id ? updatedAnecdote : anec
        )
      }))
    },
    // Ahora 'remove' está correctamente dentro del objeto 'actions'
    remove: async (id) => {
      await anecdoteService.remove(id)
      set((state) => ({
        anecdotes: state.anecdotes.filter(a => a.id !== id)
      }))
    },
    setFilter: (value) => set({ filter: value })
  }
}))

export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)
export const useFilter = () => useAnecdoteStore(state => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore(state => state.actions)

export const useVisibleAnecdotes = () => {
  const anecdotes = useAnecdoteStore(state => state.anecdotes)
  const filter = useAnecdoteStore(state => state.filter)

  return anecdotes.filter(a => 
    a.content.toLowerCase().includes(filter.toLowerCase())
  )
}
```

App.jsx:

```
import { useEffect } from 'react'
import { useAnecdoteActions, useAnecdotes } from './store'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'
import Filter from './components/Filter'

const App = () => {
  const { initialize } = useAnecdoteActions()
  const anecdotes = useAnecdotes()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    console.log('Anécdotas cargadas en el store:', anecdotes)
  }, [anecdotes])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdoteList />
      <AnecdoteForm /> 
    </div>
  )
}

export default App
```

## Tarea 6.13 Anécdotas, Paso 12

store.js:

```
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '', 
  actions: {
    initialize: async () => {
      const data = await anecdoteService.getAll()
      set({ anecdotes: data })
    },
    create: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)
      set((state) => ({
        anecdotes: [...state.anecdotes, newAnecdote]
      }))
    },
    vote: async (id) => {
      const state = useAnecdoteStore.getState()
      const anecdoteToVote = state.anecdotes.find(a => a.id === id)
      const updatedAnecdote = await anecdoteService.updateVotes(anecdoteToVote)

      set((state) => ({
        anecdotes: state.anecdotes.map((anec) => 
          anec.id === id ? updatedAnecdote : anec
        )
      }))
    },
    remove: async (id) => {
      await anecdoteService.remove(id)
      set((state) => ({
        anecdotes: state.anecdotes.filter(a => a.id !== id)
      }))
    },
    setFilter: (value) => set({ filter: value })
  }
}))

export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)
export const useFilter = () => useAnecdoteStore(state => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore(state => state.actions)

export const useVisibleAnecdotes = () => {
  const anecdotes = useAnecdoteStore(state => state.anecdotes)
  const filter = useAnecdoteStore(state => state.filter)

  const filtered = anecdotes.filter(a => 
    a.content.toLowerCase().includes(filter.toLowerCase())
  )

  return [...filtered].sort((a, b) => b.votes - a.votes)
}
```

anecdotes.js:

```
import axios from 'axios'
const baseUrl = 'http://localhost:3001/anecdotes'

const remove = async (id) => {
    const response = await axios.delete(`${baseUrl}/${id}`)
    return response.data
}

const getAll = async () => {
    const response = await fetch(baseUrl)
    return response.json()
}

const createNew = async (content) => {
    const object = { content, votes: 0 }
    const response = await axios.post(baseUrl, object)
    return response.data
}

const updateVotes = async (anecdote) => {
    const updated = { ...anecdote, votes: anecdote.votes + 1 }
    const response = await fetch(`${baseUrl}/${anecdote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ votes: updated.votes })
    })
    return response.json()
}

export default { getAll, createNew, updateVotes, remove }
```


App.js:

```
import { useEffect } from 'react'
import { useAnecdoteActions, useAnecdotes } from './store'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'
import Filter from './components/Filter'

const App = () => {
  const { initialize } = useAnecdoteActions()
  const anecdotes = useAnecdotes()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    console.log('Anécdotas cargadas en el store:', anecdotes)
  }, [anecdotes])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdoteList />
      <AnecdoteForm /> 
    </div>
  )
}

export default App
```

Anecdote.List.jsx:

```
import { useVisibleAnecdotes, useAnecdoteActions } from '../store'
import { useNotificationActions } from '../notificationStore'

const AnecdoteList = () => {
  const anecdotes = useVisibleAnecdotes()
  const { vote, remove } = useAnecdoteActions()
  const setNotification = useNotificationActions()

  const handleDelete = (anecdote) => {
    if (window.confirm(`Delete '${anecdote.content}'?`)) {
      remove(anecdote.id)
      setNotification(`Deleted '${anecdote.content}'`, 5)
    }
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
            <button onClick={() => handleDelete(anecdote)}>delete</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList
```


## Tarea 6.14 Anécdotas, Paso 13

AnecdoteList.jsx:

```
import { useVisibleAnecdotes, useAnecdoteActions } from '../store'
import { useNotificationActions } from '../notificationStore'

const AnecdoteList = () => {
  const anecdotes = useVisibleAnecdotes()
  console.log('Anecdotas filtradas recibidas por el componente:', anecdotes)
  const { vote, remove } = useAnecdoteActions()
  const setNotification = useNotificationActions()

  const handleDelete = (anecdote) => {
    if (window.confirm(`Delete '${anecdote.content}'?`)) {
      remove(anecdote.id)
      setNotification(`Deleted '${anecdote.content}'`, 5)
    }
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
            <button onClick={() => handleDelete(anecdote)}>delete</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList
```


## Tarea 6.15 Anécdotas, Paso 14

store.js:

```
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '', 
  actions: {
    initialize: async () => {
      const data = await anecdoteService.getAll()
      set({ anecdotes: data })
    },
    create: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)
      set((state) => ({
        anecdotes: [...state.anecdotes, newAnecdote]
      }))
    },
    vote: async (id) => {
      const state = useAnecdoteStore.getState()
      const anecdoteToVote = state.anecdotes.find(a => a.id === id)
      const updatedAnecdote = await anecdoteService.updateVotes(anecdoteToVote)
      
      console.log('Anécdota actualizada tras votar:', updatedAnecdote)

      set((state) => ({
        anecdotes: state.anecdotes.map((anec) => 
          anec.id === id ? updatedAnecdote : anec
        )
      }))
    },
    remove: async (id) => {
      await anecdoteService.remove(id)
      set((state) => ({
        anecdotes: state.anecdotes.filter(a => a.id !== id)
      }))
    },
    setFilter: (value) => set({ filter: value })
  }
}))

export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)
export const useFilter = () => useAnecdoteStore(state => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore(state => state.actions)

export const useVisibleAnecdotes = () => {
  const anecdotes = useAnecdoteStore(state => state.anecdotes)
  const filter = useAnecdoteStore(state => state.filter)

  const filtered = anecdotes.filter(a => 
    a.content.toLowerCase().includes(filter.toLowerCase())
  )

  return [...filtered].sort((a, b) => b.votes - a.votes)
}
```

AnecdoteList.jsx:

```
import { useVisibleAnecdotes, useAnecdoteActions } from '../store'
import { useNotificationActions } from '../notificationStore'

const AnecdoteList = () => {
  const anecdotes = useVisibleAnecdotes()
  console.log('Anecdotas filtradas recibidas por el componente:', anecdotes)
  const { vote, remove } = useAnecdoteActions()
  const setNotification = useNotificationActions()

  const handleDelete = (anecdote) => {
    if (window.confirm(`Delete '${anecdote.content}'?`)) {
      remove(anecdote.id)
      setNotification(`Deleted '${anecdote.content}'`, 5)
    }
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
            <button onClick={() => handleDelete(anecdote)}>delete</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList
```

## Ejercicio 6.16

requests.js:

```
const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
    const response = await fetch(baseUrl)
    if (!response.ok) {
        throw new Error('Failed to fetch anecdotes')
    }
    return response.json()
}

export const createAnecdote = async (newAnecdote) => {
    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnecdote),
    })
    if (!response.ok) {
        throw new Error('Failed to create anecdote')
    }
    return response.json()
}
```

main.jsx:

```
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
```


AnecdoteForm.jsx:

```
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.reset()
    
    // Ejecutamos la mutación
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
```


App.jsx:

```
import { useQuery } from '@tanstack/react-query'
import { getAnecdotes } from './requests'
import AnecdoteForm from './components/AnecdoteForm'

const App = () => {
  const result = useQuery({
  queryKey: ['anecdotes'],
  queryFn: getAnecdotes,
  retry: false
  })

  if (result.isPending) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
      <AnecdoteForm />
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
```

## Ejercicio 6.17

requests.js:

```
const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
    const response = await fetch(baseUrl)
    if (!response.ok) {
        throw new Error('Failed to fetch anecdotes')
    }
    return response.json()
}

export const createAnecdote = async (newAnecdote) => {
    const response = await fetch('http://localhost:3001/anecdotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnecdote)
    })
    
    if (!response.ok) {
    throw new Error('Server error: content must be at least 5 characters')
    }
    return response.json()
}

export const updateAnecdote = async (anecdote) => {
    const response = await fetch(`http://localhost:3001/anecdotes/${anecdote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...anecdote, votes: anecdote.votes + 1 })
    })
    return response.json()
}
```

AnecdoteForm.jsx:

```
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'

  const AnecdoteForm = () => {
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.reset()
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
```


App.jsx:

```
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './requests'
import AnecdoteForm from './components/AnecdoteForm'

const App = () => {
  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false
  })

  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  if (result.isPending) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data
  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

  return (
    <div>
      <h3>Anecdote app</h3>
      <AnecdoteForm />
      {sortedAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => voteMutation.mutate(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
```

## Ejercicio 6.18

requests.js:

```
const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
    const response = await fetch(baseUrl)
    if (!response.ok) {
        throw new Error('Failed to fetch anecdotes')
    }
    return response.json()
}

export const createAnecdote = async (newAnecdote) => {
    const response = await fetch('http://localhost:3001/anecdotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnecdote)
    })
    
    if (!response.ok) {
    throw new Error('Server error: content must be at least 5 characters')
    }
    return response.json()
}

export const updateAnecdote = async (anecdote) => {
    const response = await fetch(`http://localhost:3001/anecdotes/${anecdote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...anecdote, votes: anecdote.votes + 1 }),
    })
    if (!response.ok) throw new Error('Failed to update')
    return response.json()
}
```


## Ejercicio 6.19

useAnecodteHooks.js:

```
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote, createAnecdote } from '../requests'

export const useAnecdoteQueries = () => {
    const queryClient = useQueryClient()

    const result = useQuery({
        queryKey: ['anecdotes'],
        queryFn: getAnecdotes,
        retry: false
    })

    const voteMutation = useMutation({
        mutationFn: updateAnecdote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
    })

    const createMutation = useMutation({
        mutationFn: createAnecdote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
    })

    return { result, voteMutation, createMutation }
}
```

App.jsx:

```
import { useAnecdoteQueries } from './hooks/useAnecdoteHooks'
import AnecdoteForm from './components/AnecdoteForm'

const App = () => {
  const { result, voteMutation } = useAnecdoteQueries()

  if (result.isPending) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data
  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

  return (
    <div>
      <h3>Anecdote app</h3>
      <AnecdoteForm />
      {sortedAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => voteMutation.mutate(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
```


## Ejercicio 6.20

NotificationContext.jsx:

```
import { createContext, useReducer, useContext } from 'react'

// En NotificationContext.jsx
const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'SET': return action.payload
        case 'CLEAR': return ''
        default: return state
    }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
    const [notification, notificationDispatch] = useReducer(notificationReducer, '')

    return (
        <NotificationContext.Provider value={[notification, notificationDispatch]}>
            {props.children}
        </NotificationContext.Provider>
    )
}

export const useNotificationValue = () => {
    const [notification] = useContext(NotificationContext)
    return notification
}

export const useNotificationDispatch = () => {
    const [, dispatch] = useContext(NotificationContext)
    return dispatch
}

export default NotificationContext
```

main.jsx:

```
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import { NotificationContextProvider } from './NotificationContext'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <NotificationContextProvider>
      <App />
    </NotificationContextProvider>
  </QueryClientProvider>
)
```


Notification.jsx:

```
import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()
  
  if (!notification) return null

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  return <div style={style}>{notification}</div>
}

export default Notification
```

AnecdoteForm.jsx:

```
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotificationDispatch } from '../NotificationContext' 

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch({ type: 'SET', payload: `anecdote '${newAnecdote.content}' created` })
      setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
    },
    onError: () => {
      dispatch({ type: 'SET', payload: 'too short anecdote, must have length 5 or more' })
      setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.reset()
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
```

useAnecdoteHooks.js:

```
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from '../requests'
import { useNotificationDispatch } from '../NotificationContext'

export const useAnecdoteQueries = () => {
    const queryClient = useQueryClient()
    const dispatch = useNotificationDispatch()

    const result = useQuery({
        queryKey: ['anecdotes'],
        queryFn: getAnecdotes,
        retry: false
    })

    const voteMutation = useMutation({
        mutationFn: updateAnecdote,
        onSuccess: (updatedAnecdote) => {
            queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
            dispatch({ 
                type: 'SET', 
                payload: `anecdote '${updatedAnecdote.content}' voted` 
        })
        setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
    }
    })

    return { result, voteMutation }
}
```

App.jsx:

```
import { useAnecdoteQueries } from './hooks/useAnecdoteHooks'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

const App = () => {
  const { result, voteMutation } = useAnecdoteQueries()

  if (result.isPending) return <div>loading data...</div>
  if (result.isError) return <div>anecdote service not available</div>

  const anecdotes = result.data
  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <AnecdoteForm />
      {sortedAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => voteMutation.mutate(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
```


## Ejercicio 6.21

AnecdoteForm.jsx

```
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotificationDispatch } from '../NotificationContext' 

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation({
  mutationFn: createAnecdote,
  onSuccess: (newAnecdote) => {
    queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    dispatch({ type: 'SET', payload: `anecdote '${newAnecdote.content}' created` })
    setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
  },
  onError: (error) => {
    dispatch({ type: 'SET', payload: error.message })
    setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
  }
})

  const onCreate = (event) => {
  event.preventDefault()
  const content = event.target.anecdote.value
  if (content.length < 5) {
    dispatch({ 
      type: 'SET', 
      payload: 'too short anecdote, must have length 5 or more' 
    })
    setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
    
    return
  }
  
  event.target.reset()
  newAnecdoteMutation.mutate({ content, votes: 0 })
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
```

requests.js:

```
const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
    const response = await fetch(baseUrl)
    if (!response.ok) {
        throw new Error('Failed to fetch anecdotes')
    }
    return response.json()
}

export const createAnecdote = async (newAnecdote) => {
    const response = await fetch('http://localhost:3001/anecdotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnecdote)
    })
    
    if (!response.ok) {
    throw new Error('Server error: content must be at least 5 characters')
    }
    return response.json()
}

export const updateAnecdote = async (anecdote) => {
    const response = await fetch(`http://localhost:3001/anecdotes/${anecdote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...anecdote, votes: anecdote.votes + 1 }),
    })
    if (!response.ok) throw new Error('Failed to update')
    return response.json()
}
```


## Ejercicio 6.22

NotificationContext.jsx:

```
import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'SET': return action.payload
        case 'CLEAR': return ''
        default: return state
    }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
    const [notification, notificationDispatch] = useReducer(notificationReducer, '')
    return (
        <NotificationContext.Provider value={[notification, notificationDispatch]}>
        {props.children}
        </NotificationContext.Provider>
    )
}

export const useNotificationValue = () => {
    const context = useContext(NotificationContext)
    return context[0]
}

export const useNotificationDispatch = () => {
    const context = useContext(NotificationContext)
    return context[1]
}

export const useNotify = () => {
    const dispatch = useContext(NotificationContext)[1]
    return (message) => {
        dispatch({ type: 'SET', payload: message })
        setTimeout(() => {
        dispatch({ type: 'CLEAR' })
        }, 5000)
    }
}

export default NotificationContext
```

AnecdoteForm.jsx:

```
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotify } from '../NotificationContext' // Solo necesitas este, ya que encapsula el dispatch

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const notify = useNotify() // Usamos el hook personalizado

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notify(`anecdote '${newAnecdote.content}' created`)
    },
    onError: () => {
      notify('too short anecdote, must have length 5 or more')
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    
    // Validación previa para feedback instantáneo
    if (content.length < 5) {
      notify('too short anecdote, must have length 5 or more')
      return
    }

    event.target.reset()
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
```


useAnecdoteHooks.js:

```
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from '../requests'
import { useNotify } from '../NotificationContext' // Importa el hook que simplifica todo

export const useAnecdoteQueries = () => {
    const queryClient = useQueryClient()
    const notify = useNotify() // Usamos el hook nuevo aquí

    const result = useQuery({
        queryKey: ['anecdotes'],
        queryFn: getAnecdotes,
        retry: false
    })

    const voteMutation = useMutation({
        mutationFn: updateAnecdote,
        onSuccess: (updatedAnecdote) => {
            queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
            
        notify(`anecdote '${updatedAnecdote.content}' voted`)
    }
    })

    return { result, voteMutation }
}
```

## No hice las tareas de Redux.