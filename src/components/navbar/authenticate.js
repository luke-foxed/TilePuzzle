import { Button, Avatar, TextField, Box, Typography, Dialog, styled, Grid, IconButton } from '@mui/material'
import { Close, LockOutlined } from '@mui/icons-material'
import { useContext } from 'react'
import { AuthUserContext } from '../../context/userProvider'

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

const CloseDialogButton = styled(IconButton)(({ theme }) => ({
  width: 'min-content',
  left: '450px',
  top: '10px',
  position: 'absolute',
  color: theme.palette.error.main,
}))

export default function Authenticate({ open, onClose, type }) {
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
    <Dialog open={open} sx={{ '.MuiPaper-root': { borderRadius: '20px' } }}>
      <CloseDialogButton disableRipple="true" onClick={onClose}>
        <Close />
      </CloseDialogButton>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ padding: '30px', width: '500px' }}
      >
        <Grid item>
          <Avatar sx={{ bgcolor: 'secondary.main', margin: 'auto' }}>
            <LockOutlined />
          </Avatar>
          <Typography variant="h5" style={{ padding: '8px' }}>
            {type === 'login' ? 'Login' : 'Sign in'}
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
            <div style={{ display: 'grid', gridGap: '20px', marginTop: '20px' }}>
              <Button color="error" type="submit" fullWidth variant="contained">
                Login
              </Button>
              <Button color="error" fullWidth onClick={() => loginWithGoogle()}>
                Login With Google
              </Button>
            </div>
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
      </Grid>
    </Dialog>
  )
}
