import { Box } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'

function Square({ filled }) {
  return (
    <Box
      sx={{
        height: '35px',
        width: '35px',
        bgcolor: filled ? 'success.main' : 'background.paper',
      }}
    />
  )
}

export default function Difficulty({ difficulty }) {
  return (
    <Grid container gap="10px" alignItems="center" justifyContent="center">
      {[...Array(5).keys()].map((square, i) => (
        <Grid>
          <Square filled={i <= difficulty - 1} />
        </Grid>
      ))}
    </Grid>
  )
}
