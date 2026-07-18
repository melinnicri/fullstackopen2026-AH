import { useNavigate } from 'react-router-dom'
import { useField, useAnecdotes } from '../hooks'


const CreateNew = () => {
  const navigate = useNavigate()
  
  const { addAnecdote } = useAnecdotes() 

  const content = useField('text')
  const author = useField('text')
  const info = useField('text')

  const { reset: resetContent, ...contentProps } = content
  const { reset: resetAuthor, ...authorProps } = author
  const { reset: resetInfo, ...infoProps } = info

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    await addAnecdote({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    
    navigate('/')
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>content <input {...contentProps} /></div>
        <div>author <input {...authorProps} /></div>
        <div>url <input {...infoProps} /></div>
        <button type="submit">create</button>
        <button type="button" onClick={() => { resetContent(); resetAuthor(); resetInfo(); }}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew