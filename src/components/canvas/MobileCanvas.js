import { RestartAlt, Timer, Gamepad, FullscreenExit, Fullscreen, ExpandLess, ExpandMore } from '@mui/icons-material'
import { Box, IconButton, styled, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useState, useEffect } from 'react'
import { use100vh } from 'react-div-100vh'
import { SquareLoader } from 'react-spinners'
import theme from '../../../styles/theme'

const getCanvasContainerStyles = (fullScreen) => (fullScreen
  ? {
    top: 0,
    left: 0,
    height: 'calc(var(--vh, 1vh) * 100)',
    position: 'fixed',
    width: '100%',
    bgcolor: 'background.default',
    overflow: 'hidden',
  }
  : {
    margin: 'auto',
    height: '300px',
    width: '300px',
    canvas: {
      borderRadius: '20px',
      height: '300px !important',
      width: '300px !important',
    },
  })

const getToolbarMargin = (expanded, height, viewportHeight) => {
  let margin = null
  if (viewportHeight > height) {
    // navbar is hidden
    margin = expanded ? '140px' : '80px'
  } else {
    margin = expanded ? '-120px' : '-60px'
  }
  return margin
}

const CanvasOverlay = styled('div', {
  shouldForwardProp: (props) => props !== 'showing',
})(({ showing }) => ({
  position: 'absolute',
  background: 'rgba(0,0,0,0.5)',
  height: '280px',
  left: '0',
  right: '0',
  marginLeft: 'auto',
  marginRight: 'auto',
  borderRadius: '20px',
  marginTop: '10px',
  width: '280px',
  zIndex: 2,
  // conditionally rendering is causing some weird errors, this will have to do instead
  display: showing ? 'flex' : 'none',
}))

const Toolbar = styled(Box, {
  shouldForwardProp: (props) => props !== 'expanded',
})(({ expanded, height, viewportHeight }) => ({
  width: '100%',
  height: '100px',
  marginTop: getToolbarMargin(expanded, height, viewportHeight),
  zIndex: 1,
  padding: '0px',
  position: 'fixed',
  transition: 'margin 600ms',
}))

export default function MobileCanvasModal({
  onClickCanvas,
  onRestartClick,
  onReset,
  time,
  moves,
  loading,
  height,
}) {
  const [fullScreen, setFullScreen] = useState(false)
  const [showToolbar, setShowToolbar] = useState(false)
  const viewportHeight = use100vh()

  useEffect(() => {
    const upperCanvas = document.getElementsByClassName('upper-canvas')[0]
    if (upperCanvas) {
      upperCanvas.style.pointerEvents = fullScreen ? 'all' : 'none'
    }
  }, [fullScreen])

  const handleCanvasClick = async () => {
    await onClickCanvas()
    setFullScreen(!fullScreen)
  }

  const handleLeaveFullScreen = () => {
    onReset()
    setFullScreen(false)
  }

  const renderToolbar = () => {
    let content = null

    if (fullScreen) {
      content = (
        <Toolbar expanded={showToolbar} height={height} viewportHeight={viewportHeight}>
          <Grid container direction="column" gap="20px">
            <Grid container justifyContent="flex-end">
              <IconButton
                disableRipple
                sx={{
                  bgcolor: 'background.default',
                  height: 'fit-content',
                  marginRight: '10px',
                  marginTop: '10px',
                }}
                onClick={() => setShowToolbar(!showToolbar)}
              >
                {!showToolbar ? (
                  <ExpandLess sx={{ color: 'white' }} />
                ) : (
                  <ExpandMore sx={{ color: 'white' }} />
                )}
              </IconButton>
            </Grid>

            <Grid>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'auto auto auto auto',
                  height: '100%',
                  justifyContent: 'space-evenly',
                  bgcolor: 'background.default',
                  width: '100%',
                }}
              >
                <IconButton
                  size="large"
                  sx={{ color: 'error.main', height: '50px' }}
                  onClick={handleLeaveFullScreen}
                >
                  <FullscreenExit fontSize="large" />
                </IconButton>
                <IconButton
                  size="large"
                  sx={{ color: 'error.main', height: '50px' }}
                  onClick={onRestartClick}
                >
                  <RestartAlt fontSize="large" />
                </IconButton>
                <Grid container gap="5px" alignItems="center" style={{ height: '50px' }}>
                  <Timer fontSize="large" sx={{ color: 'secondary.main' }} />
                  <Typography variant="h5">{time}</Typography>
                </Grid>
                <Grid container gap="5px" alignItems="center" style={{ height: '50px' }}>
                  <Gamepad fontSize="large" sx={{ color: 'secondary.main' }} />
                  <Typography variant="h5">{moves}</Typography>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      )
    }
    return content
  }

  return (
    <Box
      onClick={fullScreen || loading ? null : handleCanvasClick}
      sx={getCanvasContainerStyles(fullScreen)}
    >
      <CanvasOverlay showing={!fullScreen}>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ height: '100%', width: '100%' }}
        >
          {loading ? (
            <>
              <SquareLoader color={theme.palette.error.main} />
              <Typography variant="h3" sx={{ textAlign: 'center' }}>
                Loading Canvas
              </Typography>
            </>
          ) : (
            <>
              <Fullscreen style={{ color: 'white' }} />
              <Typography style={{ textAlign: 'center', color: 'white' }}>
                Press to Start!
              </Typography>
            </>
          )}
        </Grid>
      </CanvasOverlay>

      <canvas id="canvas" style={{ pointerEvents: fullScreen ? 'all' : 'none', zIndex: 1 }} />

      {renderToolbar()}
    </Box>
  )
}
