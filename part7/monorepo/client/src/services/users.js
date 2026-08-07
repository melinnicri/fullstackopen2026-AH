import axios from 'axios'
const baseUrl = '/api/users'

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data.map(u => ({ 
        ...u, 
        id: u.id || u._id || `temp-${Math.random()}` 
    }))
}

export default { getAll }