// src/components/LoginForm.jsx
import { TextField, Button, Paper, Typography, Box } from '@mui/material'

const LoginForm = ({ handleLogin, username, setUsername, password, setPassword }) => {
    return (
    <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Log in to application</Typography>
        
        <form onSubmit={handleLogin}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

            <TextField 
                label="username" 
                value={username}
                onChange={({ target }) => setUsername(target.value)} 
            />

            <TextField 
                label="password" 
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)} 
            />

            <Button variant="contained" type="submit">
                LOGIN
            </Button>

        </Box>
        </form>
    </Paper>
    )
}

export default LoginForm