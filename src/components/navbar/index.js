import { AppBar, Button, styled, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import Link from 'next/link'
import { Fragment, useContext, useState } from 'react'
import { SquareLoader } from 'react-spinners'
import Image from 'next/image'
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

function Navbar({ isMobile }) {
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
      <StyledTopBar
        position="static"
        sx={{
          width: '100%',
          boxShadow: '0px 6px 5px -2px rgba(0,0,0,0.3)',
          padding: '20px 0px',
          height: 'auto',
        }}
      >
        <Grid
          container
          alignItems="center"
          style={{ height: '100%', width: '85%', margin: 'auto' }}
        >
          <Grid xs={8} md={8}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Grid container alignItems="center" gap="20px">
                <Image
                  src="/tile_icon.png"
                  width={isMobile ? 50 : 80}
                  height={isMobile ? 50 : 80}
                />
                <Typography variant={isMobile ? 'h3' : 'h1'}>TILED</Typography>
              </Grid>
            </Link>
          </Grid>
          <Grid xs={1} md={2} />
          <Grid container xs={3} md={2} gap="20px" justifyContent="flex-end">
            {renderUserActions()}
          </Grid>
        </Grid>
      </StyledTopBar>

      {authType && <Authenticate type={authType} onClose={() => setAuthType(null)} />}
    </>
  )
}

export default Navbar
