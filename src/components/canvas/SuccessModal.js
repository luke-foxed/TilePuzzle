import { CheckCircleOutline } from '@mui/icons-material'
import { Avatar, Button, Typography, Box, styled, Link } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useCallback, useContext, useEffect } from 'react'
import { enqueueSnackbar } from 'notistack'
import { useRouter } from 'next/router'
import { AuthUserContext } from '../../context/userProvider'
import { StyledModal } from '../shared'

const StyledBox = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1.4fr 0.6fr',
  gridTemplateRows: '1fr 1fr',
  gap: '0px 10px',
})

export default function SuccessModal({ open, gameData, id }) {
  const { authUser } = useContext(AuthUserContext)
  const router = useRouter()
  const { moves, time } = gameData

  const postScore = useCallback(() => {
    const date = new Date().toLocaleDateString()
    const data = { moves, time, date, user: authUser ? authUser.displayName : 'Anonymous' }
    return fetch(`/api/gradients/${id}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    }).catch((err) => {
      enqueueSnackbar('Error saving score', { variant: 'error' })
      throw err
    })
  }, [authUser, id, moves, time])

  useEffect(() => {
    if (open) {
      postScore()
    }
  }, [open, postScore])

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
          <Typography variant="h6" style={{ textAlign: 'end' }}>{time}</Typography>
          <Typography variant="h6" style={{ textAlign: 'start' }}>Moves Taken:</Typography>
          <Typography variant="h6" style={{ textAlign: 'end' }}>{moves}</Typography>
        </StyledBox>

        <Box sx={{ display: 'grid', gap: '10px' }}>
          <Button
            variant="contained"
            style={{ width: '240px' }}
            size="large"
            onClick={() => router.reload()}
          >
            Replay Level
          </Button>
          <Link style={{ textDecoration: 'none' }} href="/gradients">
            <Button variant="contained" style={{ width: '240px' }} size="large">
              View Levels
            </Button>
          </Link>
        </Box>
      </Grid>
    </StyledModal>
  )
}
