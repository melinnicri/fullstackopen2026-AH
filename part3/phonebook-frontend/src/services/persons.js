import axios from 'axios'
// phonebook-frontend/src/...
//const baseUrl = 'http://localhost:3001/api/persons'
// Antes: const baseUrl = 'http://localhost:3001/api/persons'
const baseUrl = '/api/persons' // Ahora es relativa
const getAll = () => axios.get(baseUrl).then(res => res.data)
const create = newPerson => axios.post(baseUrl, newPerson).then(res => res.data)
const remove = id => axios.delete(`${baseUrl}/${id}`)

const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject).then(res => res.data)
}

export default { getAll, create, remove, update }
