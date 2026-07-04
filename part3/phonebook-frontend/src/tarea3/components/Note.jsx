const Note = ({ note }) => {
  return <li>{note.content}</li>
}

export default Note


const addNote = (event) => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    important: Math.random() > 0.5,
    id: String(notes.length + 1),
  }

  setNotes(notes.concat(noteObject))
  setNewNote('')
}