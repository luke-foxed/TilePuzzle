import { RestartAlt, Timer, Gamepad, FullscreenExit, Fullscreen } from '@mui/icons-material'
import { Box, IconButton, styled, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useState, useEffect } from 'react'

const getCanvasContainerStyles = (fullScreen) => (fullScreen
  ? {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
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

export default function MobileCanvasModal({ onClickCanvas, onRestartClick, onReset, time, moves }) {
  const [fullScreen, setFullScreen] = useState(false)

  useEffect(() => {
    const upperCanvas = document.getElementsByClassName('upper-canvas')[0]
    if (upperCanvas) {
      upperCanvas.style.pointerEvents = fullScreen ? 'all' : 'none'
    }
  }, [fullScreen])

  const handleCanvasClick = () => {
    setFullScreen(!fullScreen)
    onClickCanvas()
  }

  const handleLeaveFullScreen = () => {
    onReset()
    setFullScreen(false)
  }

  return (
    <Box
      onClick={fullScreen ? null : handleCanvasClick}
      sx={getCanvasContainerStyles(fullScreen)}
    >
      <CanvasOverlay showing={!fullScreen}>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ height: '100%', width: '100%' }}
        >
          <Fullscreen style={{ color: 'white' }} />
          <Typography style={{ textAlign: 'center', color: 'white' }}>Press to Start!</Typography>
        </Grid>
      </CanvasOverlay>

      <canvas id="canvas" style={{ pointerEvents: fullScreen ? 'all' : 'none', zIndex: 1 }} />

      {fullScreen && (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto auto auto auto',
          height: '100%',
          justifyContent: 'space-evenly',
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
      )}
    </Box>
  )
}
