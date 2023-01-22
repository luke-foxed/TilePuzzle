import { Box, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'

function Square({ filled }) {
  return (
    <Box
      sx={{
        width: '35px',
        height: '35px',
        bgcolor: filled ? 'success.main' : 'background.paper',
      }}
    />
  )
}

export default function Difficulty({ difficulty }) {
  return (
    <Grid container direction="row" gap="20px">
      <Grid xs={12} md="auto" alignItems="center" justifyContent="center">
        <Typography sx={{ textAlign: 'center' }} variant="h6">DIFFICULTY</Typography>
      </Grid>

      <Grid xs={12} md="auto" container gap="10px" alignItems="center" justifyContent="center">
        {[...Array(5).keys()].map((square, i) => (
          <Grid>
            <Square filled={i <= difficulty - 1} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  )
}
