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
  // rather than resetting the heavy logic in <Canvas /> to restart the game,
  // change the key passed to the component instead so that it will remount
  // https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key
  const [key, setKey] = useState(0)

  const handleRestartClick = () => {
    setKey(key + 1)
    setGameStarted(false)
  }

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
          <Grid xs={12} md={6}>
            <StyledHeader size={isMobile ? 'h4' : 'h3'}>
              Level
              {' '}
              {gradientData.level}
            </StyledHeader>
          </Grid>

          <Grid
            container
            xs={12}
            md={6}
            sx={{ margin: isMobile ? '30px' : 'auto' }}
            justifyContent={isMobile ? 'center' : 'end'}
          >
            <Difficulty difficulty={gradientData.difficulty} />
          </Grid>
        </Grid>

        <Grid sx={{ margin: '50px 0' }}>
          <Canvas
            key={key}
            isMobile={isMobile}
            gradient={gradientData}
            gameStarted={gameStarted}
            onRestart={handleRestartClick}
            onGameToggle={(toggle) => setGameStarted(toggle)}
          />
        </Grid>

        <Grid container sx={{ width: '100%' }}>
          <StyledHeader size={isMobile ? 'h4' : 'h3'}>Leaderboards</StyledHeader>
          {renderScoreboard()}
        </Grid>
      </Grid>
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
