import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'
import { Link } from 'react-router-dom'

const UserList = () => {
    const { data: users, isLoading, isError } = useQuery({ 
        queryKey: ['users'], 
        queryFn: userService.getAll 
    })

    if (isLoading) return <div>Cargando...</div>
    if (isError) return <div>Error al cargar usuarios</div>
    ("Datos de usuarios recibidos:", users);
    const ids = users.map(u => u.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
        console.warn("¡CUIDADO! Hay IDs duplicados en tu lista de usuarios.");
    }
    
    return (
    <div>
        <h2>Users</h2>
        <table>
        <thead>
            <tr>
            <th>User</th>
            <th>Blogs created</th>
            </tr>
        </thead>
        <tbody>
    {users.map(u => {
        if (!u.id) {
            console.error("Usuario sin ID detectado:", u);
        }
        
        return (
            <tr key={u.id}>
                <td>
                    <Link to={`/users/${u.id}`}>{u.name}</Link>
                </td>
                <td>{u.blogs.length}</td>
            </tr>
        )
    })}
</tbody>
        </table>
    </div>
    )
}

export default UserList