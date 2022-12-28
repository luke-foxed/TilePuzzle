import { AppBar, Button, Grid, styled, Typography } from '@mui/material'
import { Fragment, useContext, useState } from 'react'
import { AuthUserContext } from '../../context/userProvider'
import Login from './login'
import SignUp from './signup'

const StyledTopBar = styled(AppBar)({
  height: '180px',
  background: 'none',
  color: 'black',
  boxShadow: 'none',
})

function Navbar() {
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { authUser, loading, logout } = useContext(AuthUserContext)

  return (
    <>
      <StyledTopBar position="static">
        <Grid
          container
          alignItems="center"
          style={{ height: '100%', width: '85%', margin: 'auto' }}
        >
          <Grid item xs="auto" md={8}>
            <Typography variant="h1">Tiled</Typography>
          </Grid>
          <Grid item md={2} />
          <Grid item md={2}>
            {!authUser && !loading ? (
              <div>
                <Button onClick={() => setShowSignupModal(true)}>Signup</Button>
                <Button onClick={() => setShowLoginModal(true)}>Login</Button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '20px', width: 'auto' }}>
                <img src={authUser.avatar} alt="avatar" width={80} />
                <Button onClick={() => logout()}>Signout</Button>
              </div>
            )}
          </Grid>
        </Grid>
      </StyledTopBar>

      <SignUp open={showSignupModal} onClose={() => setShowSignupModal(false)} />
      <Login open={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  )
}

export default Navbar
