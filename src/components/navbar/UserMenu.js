import { Logout, SportsEsports } from '@mui/icons-material'
import { Box, ButtonBase, Divider, Menu, MenuItem, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useContext, useState } from 'react'
import { AuthUserContext } from '../../context/userProvider'

const MENU_PAPER_PROPS = {
  elevation: 0,
  sx: {
    minWidth: '200px',
    bgcolor: 'background.paper',
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

export default function UserMenu() {
  const [anchorEl, setAnchorEl] = useState(null)
  const { authUser, logout } = useContext(AuthUserContext)
  const menuOpen = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <div style={{ display: 'flex', gap: '20px', width: 'auto' }}>
      <ButtonBase onClick={handleClick} sx={{ border: '4px dashed #202C5A' }}>
        <img
          src={authUser.avatar}
          alt="avatar"
          style={{ objectFit: 'cover', padding: '10px', width: 'max(7vw, 70px)' }}
        />
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
  )
}
