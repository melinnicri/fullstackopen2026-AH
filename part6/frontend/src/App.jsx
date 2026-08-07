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