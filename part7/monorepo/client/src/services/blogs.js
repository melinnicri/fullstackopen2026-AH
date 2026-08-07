import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data.map(b => ({ ...b, id: b.id || b._id }))
}

const createNew = async (blogObject) => {
    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.post(baseUrl, blogObject, config)
    return response.data
}

const update = async (blog) => {
    const config = {
        headers: { Authorization: token },
    }

    const { id, _id, __v, ...dataToUpdate } = blog
    
    const response = await axios.put(`${baseUrl}/${id}`, dataToUpdate, config)
    return response.data
}

const remove = (id) => axios.delete(`${baseUrl}/${id}`).then(res => res.data)

let token = null

const setToken = (newToken) => {
    token = `Bearer ${newToken}`
}

const addComment = async (id, comment) => {
    const response = await axios.post(`${baseUrl}/${id}/comments`, { comment })
    return response.data
}

const getOne = async (id) => {
    const response = await axios.get(`${baseUrl}/${id}`)
    return response.data
}

export default { getAll, createNew, update, remove, setToken, addComment, getOne }