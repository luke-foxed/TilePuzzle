import { Gamepad, PlayArrow, RestartAlt, Timer } from '@mui/icons-material'
import { IconButton, Slider, Typography, Box } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { fabric } from 'fabric-pure-browser'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useStopwatch } from 'react-timer-hook'
import { mouseDownListener, mouseUpListener, objectMovingListener } from '../../utils/canvasHelpers'
import { generateTiles, swapTiles } from '../../utils/tileHelpers'
import { StyledContainer } from '../shared'
import SuccessModal from './SuccessModal';

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

export default function Canvas({ imageInput, gameStarted, onGameToggle, onGameCompleted }) {
  const canvasRef = useRef()
  const [canvas, setCanvas] = useState(null)
  const [canvasState, setCanvasState] = useState(null)
  const [tileCount, setTileCount] = useState(2)
  const [moves, setMoves] = useState(0)
  const [winner, setWinner] = useState(false)
  const { seconds, minutes, start: startTimer, reset, pause } = useStopwatch({ autoStart: false })

  const timeTaken = `${minutes}:${seconds > 9 ? seconds : `0${seconds}`}`

  // this allows for hooks to observe canvas changes rather than relying on fabric event listeners
  const objectModifiedListener = useCallback((event) => {
    const newCanvasState = event.target.canvas.toJSON(['moves'])
    setCanvasState(newCanvasState)
    setMoves(event.target.canvas.moves)
  }, [])

  useEffect(() => {
    const newCanvas = new fabric.Canvas(canvasRef.current, { selection: false })

    // messy, but I'm tracking the moves as a custom attribute attached to the 'canvas'
    // this way, I can better track moves and this fixes some issues with useEffect loops
    newCanvas.moves = 1

    newCanvas.on('object:modified', objectModifiedListener)
    newCanvas.on('mouse:up', mouseUpListener)
    newCanvas.on('mouse:down', mouseDownListener)
    newCanvas.on('object:moving', objectMovingListener)

    setCanvas(newCanvas)

    // Don't forget to destroy canvas and remove event listeners on component unmount
    return () => newCanvas.dispose()
  }, [objectModifiedListener])

  useEffect(() => {
    if (canvasState) {
      const currentOrder = canvas.getObjects().map((obj) => obj.index)
      const correctOrder = [...Array(currentOrder.length).keys()]
      const hasWon = JSON.stringify(currentOrder) === JSON.stringify(correctOrder)
      if (hasWon) {
        onGameCompleted({ completed: true, moves, timeTaken })
        setWinner(true)
        pause()
      }
    }
  }, [canvas, canvasState, moves, onGameCompleted, pause, timeTaken])

  useEffect(() => {
    if (canvas) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = typeof imageInput === 'string' ? imageInput : URL.createObjectURL(imageInput)
      img.onload = () => {
        const fabricImage = new fabric.Image(img)
        canvas.setWidth(img.width)
        canvas.setHeight(img.height)
        canvas.setBackgroundImage(fabricImage, canvas.renderAll.bind(canvas), {
          originX: 'left',
          originY: 'top',
        })
      }
    }
  }, [canvas, imageInput])

  const handleStartClick = () => {
    generateTiles(1, tileCount, canvas)

    // clear the background image after we've added some tiles
    const image = new fabric.Image('')
    canvas.setBackgroundImage(image, canvas.renderAll.bind(canvas))

    onGameToggle(true)
    startTimer()
  }

  const handleRestartClick = () => {
    const objects = canvas.getObjects()
    const order = [...Array(objects.length).keys()]
    order.forEach((idx) => {
      const tileA = objects[idx]
      const tileB = objects[Math.floor(Math.random() * objects.length)]

      if (tileA.index !== tileB.index) {
        swapTiles(tileA, tileB) // jumble tiles in a new random order
        canvas.renderAll()
      }
    })
    reset()
    setWinner(false)
    setMoves(0)
  }

  return (
    <>
      <StyledContainer style={{ margin: '20px' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'auto 1px auto 1fr',
            gap: '20px',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4">Level 1</Typography>

          <div style={{ border: '1px solid white', height: '100%' }} />

          <Grid container>
            <IconButton
              size="large"
              sx={{ color: 'error.main' }}
              onClick={handleStartClick}
              disabled={gameStarted}
            >
              <PlayArrow fontSize="large" />
            </IconButton>

            <IconButton size="large" sx={{ color: 'error.main' }} onClick={handleRestartClick}>
              <RestartAlt fontSize="large" />
            </IconButton>
          </Grid>

          <Grid container justifyContent="flex-end" alignItems="center" gap="20px">
            <Grid container gap="5px" alignItems="center">
              <Timer fontSize="large" sx={{ color: 'secondary.main' }} />
              <Typography variant="h5">{timeTaken}</Typography>
            </Grid>
            <Grid container gap="5px" alignItems="center">
              <Gamepad fontSize="large" sx={{ color: 'secondary.main' }} />
              <Typography variant="h5">{moves}</Typography>
            </Grid>
          </Grid>
        </Box>
        <Grid container style={{ width: 'min-content', margin: 'auto' }}>
          <canvas ref={canvasRef} id="canvas" style={{ padding: '20px' }} />
          <Slider
            value={tileCount}
            step={2}
            marks={DIFFICULTIES}
            min={2}
            max={8}
            onChange={(e, val) => setTileCount(val)}
          />
        </Grid>
      </StyledContainer>

      {/* the winning move won't increment the counter without causing loop, so doing it here  */}
      <SuccessModal
        open={winner}
        timeTaken={timeTaken}
        movesTaken={moves}
        onClose={() => handleRestartClick()}
      />
    </>
  )
}
