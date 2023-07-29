import {
  RestartAlt,
  Timer,
  Gamepad,
  FullscreenExit,
  Fullscreen,
} from '@mui/icons-material'
import { Box, IconButton, styled, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useState } from 'react'
import { SquareLoader } from 'react-spinners'
import theme from '../../../styles/theme'

const getCanvasContainerStyles = (fullScreen, image) => (fullScreen
  ? {
    top: 0,
    left: 0,
    position: 'fixed',
    width: '100%',
    bgcolor: 'background.default',
    overflow: 'hidden',
  }
  : {
    margin: 'auto',
    height: '300px',
    width: '300px',
    backgroundImage: `url(${image})`, // Use the Image object as background image
    backgroundSize: 'cover', // Customize background size as needed
  })

const CanvasOverlay = styled('div', {
  shouldForwardProp: (props) => props !== 'showing',
})(({ showing }) => ({
  position: 'absolute',
  background: 'rgba(0,0,0,0.5)',
  height: '300px',
  left: '0',
  right: '0',
  marginLeft: 'auto',
  marginRight: 'auto',
  border: '1px dashed white',
  width: '300px',
  zIndex: 2,
  // conditionally rendering is causing some weird errors, this will have to do instead
  display: showing ? 'flex' : 'none',
}))

const Toolbar = styled(Box)(() => ({
  width: '100%',
}))

export default function MobileCanvasModal({
  onClickCanvas,
  onRestartClick,
  onReset,
  time,
  moves,
  loading,
  image,
  canvasComponent,
}) {
  const [fullScreen, setFullScreen] = useState(false)
  const canvasHeight = document.getElementById('tile-canvas')?.clientHeight || 0
  // height of window - 10px margin top (set below) - minus the height of the canvas
  const toolbarHeight = `${(window.visualViewport.height - 10) - canvasHeight}px`

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
        <Toolbar sx={{ height: toolbarHeight }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto auto auto auto',
              alignItems: 'center',
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
        </Toolbar>
      )
    }
    return content
  }

  return (
    <Box
      onClick={fullScreen || loading ? null : handleCanvasClick}
      sx={getCanvasContainerStyles(fullScreen, image)}
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

      {fullScreen && <div style={{ marginTop: '10px' }}>{canvasComponent}</div>}

      {renderToolbar()}
    </Box>
  )
}
