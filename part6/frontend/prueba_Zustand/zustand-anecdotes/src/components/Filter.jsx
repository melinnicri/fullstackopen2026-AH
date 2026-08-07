import { useAnecdoteActions } from '../store'

const Filter = () => {
    const { setFilter } = useAnecdoteActions()

    const handleChange = (event) => {
        setFilter(event.target.value) // Actualiza el filtro en el store
    }

    return (
    <div>
        filter <input onChange={handleChange} />
    </div>
    )
}

export default Filter