import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'
import { Link } from 'react-router-dom'

const UserView = () => {
    const { data: users, isLoading } = useQuery({ 
        queryKey: ['users'], 
        queryFn: userService.getAll 
    })

    if (isLoading) return <div>Cargando...</div>

    return (
    <div>
        <h2>Users</h2>
        <table>
        <thead>
            <tr>
            <th></th>
            <th>blogs created</th>
            </tr>
        </thead>
        <tbody>
            {users.map(user => (
            <tr key={user.id}>
                <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
                <td>{user.blogs?.length || 0}</td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    )
}

export default UserView