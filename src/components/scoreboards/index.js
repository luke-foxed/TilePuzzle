import { Gamepad, Timer } from '@mui/icons-material'
import { Avatar, Box, Paper, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import theme from '../../../styles/theme'

export default function Scoreboards({ scores }) {
  const getFewestMoves = () => scores.reduce((prev, cur) => (prev.moves < cur.moves ? prev : cur))

  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      spacing={{ xs: 0, md: 10 }}
      sx={{ width: '100%', maxWidth: '900px' }}
    >
      <Grid xs={12} md={6} p="30px">
        <Paper
          sx={{
            height: '300px',
            bgcolor: 'background.paper',
            borderRadius: '20px',
          }}
        >
          <Box sx={{ bgcolor: 'secondary.main', borderRadius: '20px' }}>
            <Typography
              sx={{ paddingTop: '10px', paddingBottom: '30px', textAlign: 'center' }}
              variant="h4"
            >
              Fastest Time
            </Typography>
          </Box>
          <Avatar
            sx={{
              color: 'secondary.main',
              bgcolor: 'background.paper',
              padding: '30px',
              borderRadius: '100%',
              marginTop: '-20px',
              marginRight: 'auto',
              marginLeft: 'auto',
            }}
          >
            <Timer sx={{ fontSize: '40px' }} />
          </Avatar>

          {scores && getFewestMoves().user}
        </Paper>
      </Grid>

      <Grid xs={12} md={6} alignItems="center" justifyContent="center" p="30px">
        <Paper
          sx={{
            height: '300px',
            bgcolor: 'background.paper',
            borderRadius: '20px',
          }}
        >
          <Box style={{ background: theme.palette.error.main, borderRadius: '20px' }}>
            <Typography
              sx={{ paddingTop: '10px', paddingBottom: '30px', textAlign: 'center' }}
              variant="h4"
            >
              Fewest Moves
            </Typography>
          </Box>
          <Avatar
            sx={{
              color: 'error.main',
              bgcolor: 'background.paper',
              padding: '30px',
              borderRadius: '100%',
              marginTop: '-20px',
              marginRight: 'auto',
              marginLeft: 'auto',
            }}
          >
            <Gamepad sx={{ fontSize: '40px' }} />
          </Avatar>
        </Paper>
      </Grid>
    </Grid>
  )
}
