import { CheckCircleOutline } from '@mui/icons-material'
import { Avatar, Button, Typography, Box, styled, Link } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const { moves, time } = gameData

  useEffect(() => {
    if (open) {
      const data = {
        moves,
        time,
        user: authUser ? authUser.displayName : 'Anonymous',
        date: new Date().toLocaleDateString(),
      }
      axios
        .post(`http://localhost:3000/api/gradients/${id}`, { data })
        .then((res) => {
          if (res.status !== 200) {
            setError(true)
          } else {
            setLoading(false)
          }
        })
        .catch(() => {
          setError(true)
        })
    }
  }, [authUser, id, moves, open, time])

  return (
    <StyledModal open={open}>
      <Grid container direction="column" gap="20px" alignItems="center">
        <Grid>
          <Avatar sx={{ bgcolor: 'success.main', margin: 'auto' }}>
            <CheckCircleOutline />
          </Avatar>
        </Grid>
        <Typography variant="h4">Success!</Typography>

        {loading && 'Loading...'}
        {error && 'Error'}

        <StyledBox>
          <Typography variant="h6" style={{ textAlign: 'start' }}>Time Taken:</Typography>
          <Typography variant="h6" style={{ textAlign: 'end' }}>{time}</Typography>
          <Typography variant="h6" style={{ textAlign: 'start' }}>Moves Taken:</Typography>
          <Typography variant="h6" style={{ textAlign: 'end' }}>{moves}</Typography>
        </StyledBox>

        <Link style={{ textDecoration: 'none' }} href="/gradients">
          <Button variant="contained" style={{ width: '240px' }} size="large">
            Continue
          </Button>
        </Link>

      </Grid>
    </StyledModal>
  )
}
