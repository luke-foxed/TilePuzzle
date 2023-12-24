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
import { MobileContext } from '../../context/mobileContext'

const StyledTopBar = styled(AppBar)(({ theme: t }) => ({
  height: '180px',
  background: t.palette.background.default,
  color: 'black',
  boxShadow: 'none',
}))

export default function Navbar() {
  const [authType, setAuthType] = useState(null)
  const { authUser, loading } = useContext(AuthUserContext)
  const { isMobile } = useContext(MobileContext)

  const renderUserActions = () => {
    let content = <UserMenu />

    if (!authUser && !loading) {
      content = (
        <>
          <Button
            size={isMobile ? 'small' : 'large'}
            variant="contained"
            onClick={() => setAuthType('signin')}
            style={{ width: '110px' }}
          >
            Sign Up
          </Button>
          <Button
            size={isMobile ? 'small' : 'large'}
            variant="contained"
            onClick={() => setAuthType('login')}
            style={{ width: '110px' }}
          >
            Login
          </Button>
        </>
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
          height: isMobile ? '120px' : '180px',
        }}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          style={{ height: '100%', width: '85%', margin: 'auto' }}
        >
          <Grid xs="auto" md={8}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Grid container alignItems="center" gap="20px">
                <Image src="/tile_icon.png" width={80} height={80} />
                {!isMobile && <Typography variant="h1">TILED</Typography>}
              </Grid>
            </Link>
          </Grid>
          <Grid xs={5} md={2} />
          <Grid
            container
            xs="auto"
            md={2}
            gap="5px"
            alignItems="center"
            direction="column"
          >
            {renderUserActions()}
          </Grid>
        </Grid>
      </StyledTopBar>

      {authType && <Authenticate type={authType} onClose={() => setAuthType(null)} />}
    </>
  )
}
