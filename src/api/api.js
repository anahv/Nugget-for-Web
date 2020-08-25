import axios from 'axios'

const user  = axios.create({
  baseURL: "https://nuggetapp.herokuapp.com/user"
  // baseURL: "http://localhost:3001/user"
})

export const register = payload => user.post(`/register`, payload);
export const login = payload => user.post(`/login`, payload);
export const logout = () => user.get("/logout")
export const checkAuthentication = () => user.get("/checkAuthentication", {withCredentials: true})
export const addUserNugget = (id, payload) => user.post(`/userNuggets/${id}`, payload)
export const getUserNuggets = (id) => user.get(`/userNuggets/${id}`)
export const updateUserNugget = (id, payload) => user.put(`/userNuggets/${id}`, payload)
export const deleteUserNugget = (id, payload) => user.post(`/deleteUserNugget/${id}`, payload)
export const checkReminders = (id, payload) => user.get(`/checkReminders/${id}`, payload)

const apis = {
    register,
    login,
    logout,
    checkAuthentication,
    addUserNugget,
    getUserNuggets,
    updateUserNugget,
    deleteUserNugget,
}

export default apis
