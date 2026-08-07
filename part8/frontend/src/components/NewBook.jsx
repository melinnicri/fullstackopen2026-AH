import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_BOOK, ALL_BOOKS } from '../queries'

const NewBook = () => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [published, setPublished] = useState('')
    const [genre, setGenre] = useState('')
    const [genres, setGenres] = useState([])

    const [createBook] = useMutation(ADD_BOOK, {
        refetchQueries: [{ query: ALL_BOOKS }],
        onError: (error) => {
            console.log(error.graphQLErrors[0]?.message);
        }
    })

    const submit = async (event) => {
        event.preventDefault()

        await createBook({
            variables: { 
                title, 
                author, 
                published: parseInt(published), 
                genres 
            }
        })

        setTitle('')
        setAuthor('')
        setPublished('')
        setGenres([])
    }

    const addGenre = () => {
        setGenres(genres.concat(genre))
        setGenre('')
    }

    return (
    <div>
        <h2>Añadir libro</h2>
        <form onSubmit={submit}>
            <div>
                título:
                <input
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>
            <div>
                autor:
                <input
                    value={author}
                    onChange={({ target }) => setAuthor(target.value)}
                />
            </div>
            <div>
                publicado:
                <input
                    type="text"
                    value={published}
                    onChange={({ target }) => setPublished(target.value)}
                />
            </div>
            <div>
                <input
                    value={genre}
                    onChange={({ target }) => setGenre(target.value)}
                />
                <button type="button" onClick={addGenre}>
                    añadir género
                </button>
            </div>
            <div>géneros: {genres.join(', ')}</div>
            <button type="submit">crear libro</button>
        </form>
    </div>
    )
}

export default NewBook