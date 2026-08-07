import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button, Paper, Typography, Box } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  
  const navigate = useNavigate()

  const addBlog = async (event) => {
    event.preventDefault()
    
    await createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
    
    navigate('/') 
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 450, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        create new
      </Typography>
      
      <form onSubmit={addBlog}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
          <TextField
            label="author"
            variant="outlined"
            fullWidth
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
          <TextField
            label="url"
            variant="outlined"
            fullWidth
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            sx={{ mt: 1 }}
          >
            CREATE
          </Button>
        </Box>
      </form>
    </Paper>
  )
}

export default BlogForm