import { Logout, SportsEsports } from '@mui/icons-material'
import {
  AppBar,
  Box,
  Button,
  ButtonBase,
  Divider,
  Menu,
  MenuItem,
  styled,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import Link from 'next/link'
import { Fragment, useContext, useState } from 'react'
import { AuthUserContext } from '../../context/userProvider'
import Authenticate from './Authenticate'

const StyledTopBar = styled(AppBar)({
  height: '180px',
  background: 'none',
  color: 'black',
  boxShadow: 'none',
})

const MENU_PAPER_PROPS = {
  elevation: 0,
  sx: {
    minWidth: '200px',
    bgcolor: 'background.paper',
    borderRadius: '20px',
    overflow: 'visible',
    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
    mt: 1.5,
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 20,
      width: 10,
      height: 10,
      bgcolor: 'error.main',
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 0,
    },
  },
}

function Navbar() {
  const [authType, setAuthType] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const { authUser, loading, logout } = useContext(AuthUserContext)
  const menuOpen = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
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
                <ButtonBase onClick={handleClick}>
                  <img src={authUser.avatar} alt="avatar" width={80} />
                </ButtonBase>

                <Menu
                  anchorEl={anchorEl}
                  open={menuOpen}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{ ...MENU_PAPER_PROPS }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <Box
                    sx={{
                      bgcolor: 'error.main',
                      marginTop: '-8px',
                      borderRadius: '20px 20px 0px 0px',
                    }}
                  >
                    <Typography variant="h5" sx={{ textAlign: 'center' }}>
                      {authUser.displayName}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 0.5 }} />

                  <MenuItem style={{ color: 'white' }}>
                    <Grid container gap="20px">
                      <SportsEsports />
                      <div>My Levels</div>
                    </Grid>
                  </MenuItem>
                  <MenuItem style={{ color: 'white' }} onClick={() => logout()}>
                    <Grid container gap="20px">
                      <Logout />
                      <div>Logout</div>
                    </Grid>
                  </MenuItem>
                </Menu>
              </div>
            )}
          </Grid>
        </Grid>
      </StyledTopBar>

      {authType && <Authenticate type={authType} onClose={() => setAuthType(null)} />}
    </>
  )
}

export default Navbar
