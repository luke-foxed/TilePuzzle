import { Button, Avatar, TextField, Box, Typography, Dialog, Container } from '@mui/material'
import { LockOutlined } from '@mui/icons-material'
import { useContext } from 'react'
import { AuthUserContext } from '../../context/userProvider'

export default function Login({ open, onClose }) {
  const { login, loginWithGoogle } = useContext(AuthUserContext)

  const handleSubmit = (event) => {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    login(data.get('email'), data.get('password'))
    onClose()
  }

  return (
    <Dialog open={open}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
            <Button onClick={() => loginWithGoogle()}>Login With Google</Button>
          </Box>
        </Box>
      </Container>
    </Dialog>
  )
}
