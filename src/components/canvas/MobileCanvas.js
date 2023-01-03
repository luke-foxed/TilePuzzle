import { RestartAlt, Timer, Gamepad, FullscreenExit } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
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
  }
  : {
    height: '300px',
    width: '300px',
    canvas: {
      borderRadius: '20px',
      height: '300px !important',
      width: '300px !important',
    },
  })

export default function MobileCanvasModal({ onClickCanvas, onRestartClick, time, moves }) {
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

  return (
    <Box onClick={fullScreen ? null : handleCanvasClick} sx={getCanvasContainerStyles(fullScreen)}>
      <canvas id="canvas" style={{ pointerEvents: fullScreen ? 'all' : 'none', height: '300px' }} />
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
          onClick={() => setFullScreen(false)}
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
    </Box>
  )
}
