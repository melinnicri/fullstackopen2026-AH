import { useState } from 'react'

const Books = ({ books }) => {
    const [genre, setGenre] = useState(null)
    
    if (!books) return null 

    const booksToShow = genre 
        ? books.filter(b => b.genres.includes(genre))
        : books

    const genres = [...new Set(books.flatMap(b => b.genres))]

    return (
    <div>
        <h2>Books</h2>
        {genre && <p>in genre <b>{genre}</b></p>}
        
        <table>
            <tbody>
            <tr>
                <th></th>
                <th>author</th>
                <th>published</th>
            </tr>
            {booksToShow.map((b) => (
                <tr key={b.title}>
                    <td>{b.title}</td>
                    <td>{b.author?.name}</td>
                    <td>{b.published}</td>
            </tr>
            ))}
        </tbody>
        </table>

        <div style={{ marginTop: '20px' }}>
        {genres.map(g => (
            <button key={g} onClick={() => setGenre(g)}>{g}</button>
        ))}
        <button onClick={() => setGenre(null)}>all genres</button>
            </div>
        </div>
    )
}

export default Books