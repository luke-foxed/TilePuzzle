import { Typography } from '@mui/material'
import { useState } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import Canvas from '../../src/components/canvas'
import { getGradients } from '../api/gradients'
import { getGradient } from '../api/gradients/[gradientID]'
import Scoreboards from '../../src/components/scoreboards'
import { StyledHeader } from '../../src/components/shared'
import Difficulty from '../../src/components/canvas/Difficulty'

function Gradient({ gradientData, isMobile }) {
  const [gameStarted, setGameStarted] = useState(false)

  const renderScoreboard = () => {
    let content = <Scoreboards scores={gradientData.scores} />
    if (gameStarted && isMobile) {
      // trying to mimic fullscreen on mobile is causing the scoreboard
      // to affect scrolling, so hide it in fullscreen
      content = null
    }
    return content
  }

  return (
    <div key={gradientData.id} className="root">
      {gradientData.url && (
        <Grid
          direction="column"
          container
          justifyContent="center"
          alignItems="center"
          sx={{ flexWrap: 'nowrap' }}
        >
          <Grid
            container
            sx={{ width: '100%' }}
            justifyContent="space-between"
            alignItems="center"
            direction="row"
          >
            <Grid>
              <StyledHeader size="h3">Level 1</StyledHeader>
            </Grid>
            <Grid container direction="row" gap="20px">
              <Typography variant="h6">DIFFICULTY</Typography>
              <Difficulty difficulty={4} />
            </Grid>
          </Grid>

          <Grid sx={{ margin: '50px 0' }}>
            <Canvas
              isMobile={isMobile}
              gradient={gradientData}
              gameStarted={gameStarted}
              onGameToggle={(toggle) => setGameStarted(toggle)}
            />
          </Grid>

          <Grid container sx={{ width: '100%' }}>
            <StyledHeader size="h3">Leaderboards</StyledHeader>
            {renderScoreboard()}
          </Grid>
        </Grid>
      )}
    </div>
  )
}

export async function getStaticPaths() {
  let paths = []
  try {
    const gradients = await getGradients()

    paths = gradients.map((gradient) => ({
      params: { gradientID: gradient.id },
    }))

    return { paths, fallback: false }
  } catch (error) {
    return { paths, fallback: false }
  }
}

export async function getStaticProps({ params }) {
  const id = params.gradientID
  const gradientData = await getGradient(id)

  return {
    props: {
      gradientData,
    },
  }
}

export default Gradient
