import {
  Button,
  Avatar,
  TextField,
  Box,
  Typography,
  styled,
  Grid,
} from '@mui/material'
import { LockOutlined, PersonAdd } from '@mui/icons-material'
import { useContext } from 'react'
import { AuthUserContext } from '../../context/userProvider'
import { StyledModal } from '../shared'

const StyledTextField = styled(TextField)(({ theme }) => ({
  '.MuiInputLabel-root': {
    color: theme.typography.h1.color,
  },
  '.MuiInputBase-root': {
    color: theme.typography.h1.color,
  },
  fieldset: {
    borderColor: 'rgba(255,255,255,0.5)',
  },
  '.MuiOutlinedInput-root:hover': {
    '& > fieldset': {
      borderColor: theme.typography.h1.color,
    },
  },
  '.Mui-focused': {
    '&:hover': {
      fieldset: {
        borderColor: theme.palette.error.main,
      },
    },
  },
  input: {
    '&:-webkit-autofill': {
      '-webkit-box-shadow': `0 0 0 100px ${theme.palette.background.paper} inset`,
      '-webkit-text-fill-color': theme.typography.h1.color,
    },
  },
}))

export default function Authenticate({ onClose, type }) {
  const { login, loginWithGoogle, createUser } = useContext(AuthUserContext)

  const handleSubmit = (event) => {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const callback = () => (type === 'login'
      ? login(data.get('email'), data.get('password'))
      : createUser(data.get('email'), data.get('password')))

    callback()
    onClose()
  }

  return (
    <StyledModal showX open>
      <Grid item>
        <Avatar sx={{ bgcolor: 'secondary.main', margin: 'auto' }}>
          {type === 'login' ? <LockOutlined /> : <PersonAdd />}
        </Avatar>
        <Typography variant="h5" style={{ padding: '8px' }}>
          {type === 'login' ? 'Login' : 'Sign Up'}
        </Typography>
      </Grid>
      <Box component="form" noValidate onSubmit={handleSubmit} style={{ padding: '10px' }}>
        <StyledTextField
          color="error"
          fullWidth
          margin="normal"
          required
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
        />
        <StyledTextField
          color="error"
          fullWidth
          required
          margin="normal"
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />

        {type === 'login' ? (
          <>
            <Button
              color="error"
              type="submit"
              fullWidth
              variant="contained"
              style={{ margin: '20px 0' }}
            >
              Login
            </Button>
            <Button color="error" fullWidth onClick={() => loginWithGoogle()}>
              Login With Google
            </Button>
          </>
        ) : (
          <Button
            style={{ marginTop: '20px' }}
            color="error"
            type="submit"
            fullWidth
            variant="contained"
          >
            Sign Up
          </Button>
        )}
      </Box>
    </StyledModal>
  )
}
