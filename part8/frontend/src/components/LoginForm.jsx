import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ setToken, setError, page }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [login, { result }] = useMutation(LOGIN, {
        onError: (error) => {
            setError(error.graphQLErrors[0].message)
        }
    })

    useEffect(() => {
        if (result && result.data) {
            const token = result.data.login.value
            setToken(token)
            localStorage.setItem('library-user-token', token)
        }
    }, [result])

    if (page !== 'login') {
        return null
    }

    const submit = async (event) => {
        event.preventDefault()
        console.log("Intentando iniciar sesión con:", username, password)
        
        try {
            const result = await login({ variables: { username, password } })
            console.log("Resultado crudo del servidor:", result)
            
            if (result && result.data && result.data.login) {
                const token = result.data.login.value || result.data.login 
                
                setToken(token)
                localStorage.setItem('library-user-token', token)
            } else {
                console.error("El servidor devolvió data.login nulo:", result)
            }
        } catch (error) {
            console.error("Error en la mutación:", error)
        }
}
    return (
    <div>
        <form onSubmit={submit}>
        <div>
            username <input
                type='text'
                value={username}
                onChange={({ target }) => setUsername(target.value)}
            />
        </div>
        <div>
            password <input
                type='password'
                value={password}
                onChange={({ target }) => setPassword(target.value)}
            />
        </div>
        <button type='submit'>login</button>
        </form>
    </div>
    )
}

export default LoginForm