import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const personsToShow = filter === ''
    ? persons
    : persons.filter(person => 
        person.name.toLowerCase().includes(filter.toLowerCase())
      )

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmUpdate) {
        const changedPerson = { ...existingPerson, number: newNumber }
        
        axios
          .put(`http://localhost:3001/api/persons/${existingPerson.id}`, changedPerson)
          .then(response => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : response.data))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            const errorMsg = error.response.data.error 
              ? error.response.data.error 
              : `Error: ${newName} has already been removed from server`
            
            setErrorMessage(errorMsg)
            setTimeout(() => setErrorMessage(null), 5000)
          })
      }
    } else {
      const personObject = { name: newName, number: newNumber }
      
      axios
        .post('http://localhost:3001/api/persons', personObject)
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
          setErrorMessage(null)
        })
        .catch(error => {
        // En lugar de hacer .split(','), usa el mensaje tal cual viene
    const fullMessage = error.response.data.error;
    setErrorMessage(fullMessage); 
    setTimeout(() => setErrorMessage(null), 5000);
})
    }
  } // <--- Esta llave cierra addPerson

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`¿Delete ${person.name}?`)) {
      axios
        .delete(`http://localhost:3001/api/persons/${id}`)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(error => {
          alert('Este contacto ya fue eliminado del servidor')
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      {errorMessage && (
        <div className="error-notification">
          {errorMessage}
        </div>
      )}

      <div>
        filter shown with <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>

      <h3>add a new</h3>

      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
        </div>
        <button type="submit">add</button>
      </form>
      
      <h2>Numbers</h2>
      <ul>
        {personsToShow.map(person => 
          <li key={person.id}>
            {person.name} {person.number} {' '}
            <button onClick={() => deletePerson(person.id)}>Delete</button>
          </li>
        )}
      </ul>
    </div>
  )
} // <--- Esta llave cierra el componente App

export default App