import { Gamepad, PlayArrow, RestartAlt, Timer } from '@mui/icons-material'
import { Slider, Typography, Box, Paper, styled, Button } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useStopwatch } from 'react-timer-hook'
import { SquareLoader } from 'react-spinners'
import { DndContext, closestCenter, PointerSensor, useSensor } from '@dnd-kit/core'
import { arraySwap, SortableContext, rectSwappingStrategy } from '@dnd-kit/sortable'
import { isEqual } from 'lodash'
import MobileCanvasModal from './MobileCanvas'
import SuccessModal from './SuccessModal'
import theme from '../../../styles/theme'
import Tile from './Tile'
import { generateTiles, shuffleTiles } from '../../utils/dndHelper'

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

const CanvasButton = styled(Button)({
  color: '#fff',
  width: '120px',
  border: '4px solid white',
  marginBottom: '0px',
  marginLeft: '-1px',
  borderBottom: 'none',
})

export default function Canvas({ gradient, gameStarted, onGameToggle, onRestart, isMobile }) {
  const { url: img, id, difficulty } = gradient
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [tilesPerRow, setTilesPerRow] = useState(difficulty * 2) // difficulty is stored as 1-5
  const [tiles, setTiles] = useState([])
  const [moves, setMoves] = useState(0)
  const [winner, setWinner] = useState(false)
  const sensors = [useSensor(PointerSensor)]
  const { seconds, minutes, start: startTimer, pause } = useStopwatch({ autoStart: false })
  const screenRef = useRef(null) // screen sizes are changing on mobile refresh, keeping them here

  const time = `${minutes}:${seconds > 9 ? seconds : `0${seconds}`}`
  const gameData = { moves, time }

  const loadImage = useCallback(() => {
    const { width, height } = screenRef.current
    const i = new Image()
    const newWidth = isMobile ? Math.round(width / 1.1) : Math.round(width * 0.8)
    const newHeight = isMobile ? Math.round(height / 1.1) : Math.round(height / 1.5)
    const adjustedURL = img.replace('h_1,w_1', `h_${newHeight},w_${newWidth},c_scale`)
    i.crossOrigin = 'anonymous'
    i.src = typeof img === 'string' ? adjustedURL : URL.createObjectURL(img)
    i.onload = () => {
      setImage(i)
      setLoading(false)
    }
    i.onerror = () => {
      setLoading(false)
      setError(true)
    }
  }, [img, isMobile])

  useEffect(() => {
    screenRef.current = {
      width: Math.round(window.visualViewport.width),
      height: Math.round(window.visualViewport.height),
    }
    loadImage()
  }, [loadImage])

  useEffect(() => {
    if (image && gameStarted) {
      generateTiles(image, tilesPerRow).then((data) => {
        setTiles(shuffleTiles(data))
      })
    }
  }, [gameStarted, image, tilesPerRow])

  useEffect(() => {
    // IDs need to start at 1 for DnD to work, so subtracting 1 here
    const currentOrder = tiles.map((tile) => tile.id - 1)
    const correctOrder = [...Array(tiles.length).keys()]

    if (currentOrder.length && isEqual(currentOrder, correctOrder)) {
      setWinner(true)
      pause()
    }
  }, [pause, tiles])

  const handleStartClick = async () => {
    onGameToggle(true)
    startTimer()
  }

  const resetCanvas = () => {
    onGameToggle(false)
    setMoves(0)
  }

  const handleDragEnd = ({ ...props }) => {
    const { active, over } = props
    if (active && over && active.id !== over.id) {
      setMoves(moves + 1)
      setTiles((itms) => {
        const oldIndex = itms.findIndex((item) => item.id === active.id)
        const newIndex = itms.findIndex((item) => item.id === over.id)

        return arraySwap(itms, oldIndex, newIndex)
      })
    }
  }

  const renderCanvas = () => (
    <CanvasWrapper id="tile-canvas">
      {loading && (
        <Grid
          container
          sx={{ width: '75vw', height: '60vh', border: '4px solid #fff' }}
          textAlign="center"
          justifyContent="center"
          alignItems="center"
        >
          <SquareLoader color={theme.palette.error.main} />
          <Typography variant="h3">Loading Canvas</Typography>
        </Grid>
      )}
      {error && <Typography variant="h3">Error Loading Canvas</Typography>}

      <Grid container gap="20px">
        {image && !tiles.length && (
          <img src={image.src} style={{ border: '4px solid white' }} alt="level" />
        )}

        <div
          style={{
            border: '4px solid white',
            display: gameStarted ? 'grid' : 'none',
            gridTemplateColumns: `repeat(${tilesPerRow}, 1fr)`,
          }}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={tiles.map((tile) => tile.id)} strategy={rectSwappingStrategy}>
              {tiles && tiles.map((tile) => <Tile tile={tile} key={tile.id} />)}
            </SortableContext>
          </DndContext>
        </div>
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
  )

  const renderFullCanvas = () => (
    <div>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1px auto 1fr',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div />

        <Grid container gap="20px">
          <CanvasButton
            startIcon={<PlayArrow fontSize="large" />}
            size="large"
            onClick={handleStartClick}
            disabled={gameStarted}
          >
            Start
          </CanvasButton>

          <CanvasButton
            size="large"
            startIcon={<RestartAlt fontSize="large" />}
            onClick={() => onRestart()}
          >
            Restart
          </CanvasButton>
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

      {renderCanvas()}
    </div>
  )

  const renderMobileCanvas = () => (
    <MobileCanvasModal
      loading={loading}
      onClickCanvas={() => handleStartClick()}
      onRestartClick={() => onRestart()}
      onReset={() => resetCanvas()}
      time={time}
      moves={moves}
      image={img}
      canvasComponent={renderCanvas()}
    />
  )

  return (
    <>
      {isMobile ? renderMobileCanvas() : renderFullCanvas()}
      <SuccessModal open={winner} gameData={gameData} id={id} />
    </>
  )
}
