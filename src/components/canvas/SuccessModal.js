import { CheckCircleOutline } from '@mui/icons-material'
import { Avatar, Button, Typography, Box, styled } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { StyledModal } from '../shared'

const StyledBox = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1.4fr 0.6fr',
  gridTemplateRows: '1fr 1fr',
  gap: '0px 10px',
})

export default function SuccessModal({ open, timeTaken, movesTaken, onClose }) {
  return (
    <StyledModal open={open}>
      <Grid container direction="column" gap="20px" alignItems="center">
        <Grid>
          <Avatar sx={{ bgcolor: 'success.main', margin: 'auto' }}>
            <CheckCircleOutline />
          </Avatar>
        </Grid>
        <Typography variant="h4">Success!</Typography>

        <StyledBox>
          <Typography variant="h6" style={{ textAlign: 'start' }}>Time Taken:</Typography>
          <Typography variant="h6" style={{ textAlign: 'end' }}>{timeTaken}</Typography>
          <Typography variant="h6" style={{ textAlign: 'start' }}>Moves Taken:</Typography>
          <Typography variant="h6" style={{ textAlign: 'end' }}>{movesTaken}</Typography>
        </StyledBox>

        <Button color="secondary" onClick={onClose}>Continue</Button>
      </Grid>
    </StyledModal>
  )
}
