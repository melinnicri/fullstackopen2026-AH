import { useState, useContext } from 'react'
import { UserContext } from '../context/UserProvider'

const LoginForm = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    
    const { login } = useContext(UserContext) 

    const handleLogin = async (event) => {
        event.preventDefault()
    await login({ username, password }) 
    }

    return (
    <form onSubmit={handleLogin}>
        <div>
            username
            <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
        />
        </div>
        <div>
        password
        <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
        />
        </div>
        <button type="submit">login</button>
    </form>
    )
}

export default LoginForm