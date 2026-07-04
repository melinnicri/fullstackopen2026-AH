import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

// Esta función es genial porque hace que el servicio sea más resistente
const getToken = () => {
  if (token) return token
  const userJSON = window.localStorage.getItem('loggedBlogAppUser')
  if (userJSON) {
    const user = JSON.parse(userJSON)
    return `Bearer ${user.token}`
  }
  return null
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: getToken() },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

// Asegúrate de que esta estructura sea correcta
const update = async (id, newObject) => {
  console.log(`Intentando actualizar blog en: /api/blogs/${id}`); // Debug útil
  const response = await axios.put(`/api/blogs/${id}`, newObject);
  return response.data;
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: getToken() },
  }
  await axios.delete(`${baseUrl}/${id}`, config)
}

// SOLO UN EXPORT AL FINAL
export default { getAll, create, update, remove, setToken }