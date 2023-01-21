import { Close } from '@mui/icons-material'
import { Box, Dialog, Grid, IconButton, styled, Typography } from '@mui/material'

const CloseDialogButton = styled(IconButton)(({ theme }) => ({
  width: 'min-content',
  padding: '20px',
  color: theme.palette.error.main,
}))

// eslint-disable-next-line import/prefer-default-export
export function StyledModal({ children, open, onClose, showX }) {
  return (
    <Dialog open={open} sx={{ '.MuiPaper-root': { borderRadius: '20px', bgcolor: 'background.default' } }}>
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

export function StyledHeader({ type, children, size }) {
  return (
    <Grid
      container
      direction="column"
      style={{ width: 'fit-content' }}
      alignItems="center"
      justifyContent="center"
      gap="10px"
    >
      <Typography variant={size}>{children}</Typography>
      <Box sx={{ border: '2px solid', width: '75%', borderColor: type === 'flat' ? 'white' : 'success.main' }} />
    </Grid>
  )
}
