import axios from 'axios'

// Al usar el proxy, basta con la ruta relativa
const baseUrl = '/api/login' 

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }