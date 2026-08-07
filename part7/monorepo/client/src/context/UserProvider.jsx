import { createContext, useState, useEffect } from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'
import persistentUser from '../services/persistentUser'

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const loggedUser = persistentUser.getUser()
        if (loggedUser) {
            setUser(loggedUser)
            ("Servicio de blogs cargado:", blogService);
            blogService.setToken(loggedUser.token)
        }
    }, [])

    const login = async (credentials) => {
    const user = await loginService.login(credentials)
        blogService.setToken(user.token) 
    
        setUser(user)
    }

    const logout = () => {
        persistentUser.removeUser()
        blogService.setToken(null)
        setUser(null)
    }

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    )
}
