import { Close } from '@mui/icons-material'
import { Box, Dialog, Grid, IconButton, styled, Typography } from '@mui/material'
import { useContext } from 'react'
import { MobileContext } from '../context/mobileProvider'

const CloseDialogButton = styled(IconButton)(({ theme }) => ({
  width: 'min-content',
  padding: '20px',
  color: theme.palette.error.main,
}))

// eslint-disable-next-line import/prefer-default-export
export function StyledModal({ children, open, onClose, showX }) {
  return (
    <Dialog open={open} sx={{ '.MuiPaper-root': { bgcolor: 'background.default' } }}>
      {showX && (
        <Grid container justifyContent="flex-end">
          <CloseDialogButton disableRipple="true" onClick={onClose}>
            <Close />
          </CloseDialogButton>
        </Grid>
      )}

      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        style={{ padding: '30px', maxWidth: '450px', marginTop: showX ? '-50px' : 'auto' }}
      >
        {children}
      </Grid>
    </Dialog>
  )
}

export function StyledHeader({ type, children, size, icon: Icon }) {
  const { isMobile } = useContext(MobileContext)
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      style={{ width: 'max-content' }}
    >
      {Icon && (
        <Grid item sx={{ bgcolor: 'success.main', padding: '10px' }}>
          <Icon sx={{ color: 'background.default', width: isMobile ? '30px' : '40px', height: isMobile ? '30px' : '40px' }} />
        </Grid>
      )}

      <Grid item>
        <Grid container direction="row" alignItems="center" justifyContent="center" gap="10px">
          <Typography variant={size} sx={{ marginLeft: '10px' }}>{children}</Typography>
          <Box
            sx={{
              border: isMobile ? '3px solid' : '3px solid',
              marginTop: isMobile ? '-1.5px' : '-5.5px',
              width: '100%',
              borderColor: type === 'flat' ? 'white' : 'success.main',
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}
