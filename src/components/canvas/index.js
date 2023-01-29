import { Gamepad, PlayArrow, RestartAlt, Timer } from '@mui/icons-material'
import { IconButton, Slider, Typography, Box, Paper, styled } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { fabric } from 'fabric-pure-browser'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useStopwatch } from 'react-timer-hook'
import { SquareLoader } from 'react-spinners'
import { mouseDownListener, mouseUpListener, objectMovingListener } from '../../utils/canvasHelpers'
import { generateTiles } from '../../utils/tileHelpers'
import MobileCanvasModal from './MobileCanvas'
import SuccessModal from './SuccessModal'
import theme from '../../../styles/theme'

const DIFFICULTIES = [
  {
    value: 2,
    label: 'Easy (4 Tiles)',
  },
  {
    value: 4,
    label: 'Medium (16 Tiles)',
  },
  {
    value: 6,
    label: 'Hard (36 Tiles)',
  },
  {
    value: 8,
    label: 'Very Hard (64 Tiles)',
  },
]

const CanvasWrapper = styled(Paper)(({ theme: t }) => ({
  background: t.palette.background.default,
  width: 'min-content',
  margin: 'auto',
}))

const Divider = styled('div')({
  height: '1px',
  border: '2px solid white',
  margin: 'auto',
})

export default function Canvas({ gradient, gameStarted, onGameToggle, onRestart, isMobile }) {
  const { url: img, id, difficulty } = gradient

  const [canvas, setCanvas] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [canvasState, setCanvasState] = useState(null)
  const [tilesPerRow, setTilesPerRow] = useState(difficulty * 2) // difficulty is stored as 1-5
  const [moves, setMoves] = useState(0)
  const [winner, setWinner] = useState(false)
  const { seconds, minutes, start: startTimer, pause } = useStopwatch({ autoStart: false })
  const screenRef = useRef(null) // screen sizes are changing on mobile refresh, keeping them here

  const time = `${minutes}:${seconds > 9 ? seconds : `0${seconds}`}`
  const gameData = { moves, time }

  // this allows for hooks to observe canvas changes rather than relying on fabric event listeners
  const objectModifiedListener = useCallback((event) => {
    const newCanvasState = event.target.canvas.toJSON(['moves'])
    setCanvasState(newCanvasState)
    setMoves(event.target.canvas.moves)
  }, [])

  const setImage = useCallback(async (can) => {
    const { width, height } = screenRef.current
    const i = new Image()
    const newWidth = isMobile ? width : Math.round(width * 0.8)
    const newHeight = isMobile ? height : Math.round(height / 1.5)
    const adjustedURL = img.replace('h_300,w_300', `h_${newHeight},w_${newWidth},c_scale`)
    i.crossOrigin = 'anonymous'
    i.src = typeof img === 'string' ? adjustedURL : URL.createObjectURL(img)
    const loaded = await new Promise((resolve, reject) => {
      i.onload = () => {
        const fabricImage = new fabric.Image(i)
        can.setDimensions({ width: newWidth, height: newHeight })
        can.setBackgroundImage(fabricImage, can.renderAll.bind(can), {
          originX: 'left',
          originY: 'top',
        })
        resolve(true)
      }
      i.onerror = () => {
        setLoading(false)
        setError(true)
        reject(new Error('Error loading image'))
      }
    })

    if (loaded) {
      setLoading(false)
    }
  }, [img, isMobile])

  useEffect(() => {
    const newCanvas = new fabric.Canvas('canvas', { selection: false })
    if (isMobile !== null) {
      screenRef.current = {
        width: Math.round(window.visualViewport.width),
        height: Math.round(window.screen.height - window.screen.availHeight),
      }
      // messy, but I'm tracking the moves as a custom attribute attached to the 'canvas'
      // this way, I can better track moves and this fixes some issues with useEffect loops
      newCanvas.moves = 1

      newCanvas.on('object:modified', objectModifiedListener)
      newCanvas.on('mouse:up', mouseUpListener)
      newCanvas.on('mouse:down', mouseDownListener)
      newCanvas.on('object:moving', objectMovingListener)

      setImage(newCanvas)
      setCanvas(newCanvas)
    }
    // Don't forget to destroy canvas and remove event listeners on component unmount
    return () => newCanvas.dispose()
  }, [img, isMobile, objectModifiedListener, setImage])

  useEffect(() => {
    if (canvasState && gameStarted) {
      const currentOrder = canvas.getObjects().map((obj) => obj.index)
      const correctOrder = [...Array(currentOrder.length).keys()]
      const hasWon = JSON.stringify(currentOrder) === JSON.stringify(correctOrder)
      if (hasWon) {
        setWinner(true)
        pause()
      }
    }
  }, [canvas, canvasState, moves, time, gameStarted, pause])

  const handleStartClick = async () => {
    await generateTiles(1, tilesPerRow, canvas)
    onGameToggle(true)
    startTimer()
  }

  const resetCanvas = () => {
    onGameToggle(false)
    setMoves(0)
    canvas.clear()
    // I don't like this but the canvas renders weird without the delay
    setTimeout(() => {
      setImage(canvas)
    }, 100)
  }

  const renderFullCanvas = () => (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1px auto 1fr',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div />

        <Grid container>
          <IconButton
            size="large"
            sx={{ color: 'error.main' }}
            onClick={handleStartClick}
            disabled={gameStarted}
          >
            <PlayArrow fontSize="large" />
          </IconButton>

          <IconButton size="large" sx={{ color: 'error.main' }} onClick={() => onRestart()}>
            <RestartAlt fontSize="large" />
          </IconButton>
        </Grid>

        <Grid container justifyContent="flex-end" alignItems="center" gap="20px">
          <Grid container gap="5px" alignItems="center">
            <Timer fontSize="large" sx={{ color: 'secondary.main' }} />
            <Typography variant="h5">{time}</Typography>
          </Grid>
          <Grid container gap="5px" alignItems="center">
            <Gamepad fontSize="large" sx={{ color: 'secondary.main' }} />
            <Typography variant="h5">{moves}</Typography>
          </Grid>
        </Grid>
      </Box>

      <CanvasWrapper>
        {loading && (
          <div>
            <SquareLoader color={theme.palette.error.main} />
            <Typography variant="h3">Loading Canvas</Typography>
          </div>
        )}
        {error && <Typography variant="h3">Error Loading Canvas</Typography>}

        <Grid container gap="20px">
          <Divider sx={{ width: '80vw' }} />
          <canvas id="canvas" />
          <Divider sx={{ width: '80vw' }} />
        </Grid>

        <Slider
          // hiding this for now
          style={{ display: 'none' }}
          value={tilesPerRow}
          step={2}
          marks={DIFFICULTIES}
          min={2}
          max={8}
          onChange={(e, val) => setTilesPerRow(val)}
        />
      </CanvasWrapper>
    </>
  )

  const renderMobileCanvas = () => (
    <MobileCanvasModal
      loading={loading}
      onClickCanvas={() => handleStartClick()}
      onRestartClick={() => onRestart()}
      onReset={() => resetCanvas()}
      time={time}
      moves={moves}
    />
  )

  return (
    <>
      {isMobile ? renderMobileCanvas() : renderFullCanvas()}
      <SuccessModal open={winner} gameData={gameData} id={id} />
    </>
  )
}
