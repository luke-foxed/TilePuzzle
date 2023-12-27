import { useContext, useState } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { SquareLoader } from 'react-spinners'
import Canvas from '../../src/components/canvas'
import Scoreboards from '../../src/components/scoreboards'
import { StyledHeader } from '../../src/components/shared'
import Difficulty from '../../src/components/canvas/Difficulty'
import { MobileContext } from '../../src/context/mobileContext'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

function Gradient() {
  const { gradientID } = useRouter().query
  const [gameStarted, setGameStarted] = useState(false)
  const { isMobile } = useContext(MobileContext)

  const { data: gradientData, isLoading } = useSWR(`/api/gradients/${gradientID}`, fetcher, {
    revalidateOnFocus: false, // Disable automatic revalidation on focus
    revalidateOnReconnect: false, // Disable automatic revalidation on reconnect
  })

  // rather than resetting the heavy logic in <Canvas /> to restart the game,
  // change the key passed to the component instead so that it will remount
  // https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key
  const [key, setKey] = useState(0)

  const handleRestartClick = () => {
    setKey(key + 1)
    setGameStarted(false)
  }

  return (
    <div className="root">
      <Grid
        direction="column"
        container
        justifyContent="center"
        alignItems="center"
        sx={{ flexWrap: 'nowrap' }}
      >
        {isLoading ? (
          <SquareLoader />
        ) : (
          <>
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
                  {gradientData?.level}
                </StyledHeader>
              </Grid>

              <Grid
                container
                xs={12}
                md={6}
                sx={{ margin: isMobile ? '30px' : 'auto' }}
                justifyContent={isMobile ? 'center' : 'end'}
              >
                <Difficulty difficulty={gradientData?.difficulty} />
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
              {gameStarted && isMobile ? null : <Scoreboards scores={gradientData?.scores} />}
            </Grid>
          </>
        )}
      </Grid>
    </div>
  )
}

export default Gradient
