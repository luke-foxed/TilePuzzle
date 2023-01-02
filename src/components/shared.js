import { Close } from '@mui/icons-material'
import { Container, Dialog, Grid, IconButton, styled } from '@mui/material'

const CloseDialogButton = styled(IconButton)(({ theme }) => ({
  width: 'min-content',
  padding: '20px',
  color: theme.palette.error.main,
}))

export const StyledContainer = styled(Container, {
  shouldForwardProp: (props) => props !== 'mobile',
})(({ mobile }) => ({
  width: mobile ? '100%' : '85%',
  margin: 'auto',
}))

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
