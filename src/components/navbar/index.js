import { AppBar, Button, Grid, styled, Typography } from '@mui/material'
import Link from 'next/link'
import { Fragment, useContext, useState } from 'react'
import { AuthUserContext } from '../../context/userProvider'
import Authenticate from './authenticate'

const StyledTopBar = styled(AppBar)({
  height: '180px',
  background: 'none',
  color: 'black',
  boxShadow: 'none',
})

function Navbar() {
  const [authType, setAuthType] = useState(null)
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
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Typography variant="h1">Tiled</Typography>
            </Link>
          </Grid>
          <Grid item md={2} />
          <Grid item md={2} gap="20px">
            {!authUser && !loading ? (
              <div>
                <Button
                  variant="contained"
                  onClick={() => setAuthType('signin')}
                  style={{ borderRadius: '20px' }}
                >
                  Signup
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setAuthType('login')}
                  style={{ borderRadius: '20px' }}
                >
                  Login
                </Button>
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

      {authType && (
        <Authenticate type={authType} onClose={() => setAuthType(null)} />
      )}
    </>
  )
}

export default Navbar
