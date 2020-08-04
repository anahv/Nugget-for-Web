import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
})

export const insertNugget = payload => api.post(`/nuggets`, payload)
export const getAllNuggets = () => api.get(`/nuggets`)
export const updateNuggetById = (id, payload) => api.put(`/nuggets/${id}`, payload)
export const deleteNuggetById = id => api.delete(`/nuggets/${id}`)
export const getNuggetById = id => api.get(`/nuggets/${id}`)

const apis = {
    insertNugget,
    getAllNuggets,
    updateNuggetById,
    deleteNuggetById,
    getNuggetById,
}

export default apis
