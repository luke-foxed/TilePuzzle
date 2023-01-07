import { AppBar, Button, styled, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import Link from 'next/link'
import { Fragment, useContext, useState } from 'react'
import { SquareLoader } from 'react-spinners'
import theme from '../../../styles/theme'
import { AuthUserContext } from '../../context/userProvider'
import Authenticate from './Authenticate'
import UserMenu from './UserMenu'

const StyledTopBar = styled(AppBar)({
  height: '180px',
  background: 'none',
  color: 'black',
  boxShadow: 'none',
})

function Navbar() {
  const [authType, setAuthType] = useState(null)
  const { authUser, loading } = useContext(AuthUserContext)

  const renderUserActions = () => {
    let content = <UserMenu />

    if (!authUser && !loading) {
      content = (
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
      )
    } else if (loading) {
      content = <SquareLoader color={theme.palette.error.main} />
    }

    return content
  }

  return (
    <>
      <StyledTopBar position="static">
        <Grid
          container
          alignItems="center"
          style={{ height: '100%', width: '85%', margin: 'auto' }}
        >
          <Grid xs={6} md={8}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Typography variant="h1">Tiled</Typography>
            </Link>
          </Grid>
          <Grid xs={2} md={2} />
          <Grid container xs={4} md={2} gap="20px" justifyContent="flex-end">
            {renderUserActions()}
          </Grid>
        </Grid>
      </StyledTopBar>

      {authType && <Authenticate type={authType} onClose={() => setAuthType(null)} />}
    </>
  )
}

export default Navbar
