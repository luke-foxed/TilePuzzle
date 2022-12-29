import { Button, Grid, Slider } from '@mui/material'
import { fabric } from 'fabric-pure-browser'
import { useCallback, useEffect, useRef, useState } from 'react'
import { mouseDownListener, mouseUpListener, objectMovingListener } from '../../utils/canvasHelpers'
import { generateTiles, swapTiles } from '../../utils/tileHelpers'

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

export default function Canvas({ imageInput, gameStarted, onGameToggle }) {
  const canvasRef = useRef()
  const [canvas, setCanvas] = useState(null)
  const [canvasState, setCanvasState] = useState(null)
  const [correctOrder, setCorrectOrder] = useState([])
  const [tileCount, setTileCount] = useState(2)

  // this allows for hooks to observe canvas changes rather than relying on fabric event listeners
  const objectModifiedListener = useCallback(
    (event) => {
      const newCanvasState = event.target.canvas.toJSON()
      setCanvasState(newCanvasState)
    },
    [setCanvasState],
  )

  useEffect(() => {
    const newCanvas = new fabric.Canvas(canvasRef.current, { selection: false })

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
      const hasWon = JSON.stringify(currentOrder) === JSON.stringify(correctOrder)

      if (hasWon) {
        // eslint-disable-next-line no-alert
        alert('WINNER')
      }
    }
  }, [canvas, canvasState, correctOrder])

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

    // set the correct order of tiles
    setCorrectOrder([...Array(tileCount * tileCount).keys()])
    onGameToggle(true)
  }

  const handleRestartClick = () => {
    const objects = canvas.getObjects()
    correctOrder.forEach((idx) => {
      if (objects[idx].index !== idx) {
        const correctObj = objects.find((obj) => obj.index === idx)
        swapTiles(objects[idx], correctObj)
        canvas.renderAll()
      }
    })

    // onGameToggle(false)
  }

  return (
    <div style={{ border: '1px solid #30BCED', margin: '20px' }}>
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
        {gameStarted ? (
          <Button
            style={{ width: '100%', borderRadius: 0 }}
            color="secondary"
            variant="contained"
            onClick={handleRestartClick}
          >
            Restart
          </Button>
        ) : (
          <Button
            style={{ width: '100%', borderRadius: 0 }}
            color="secondary"
            variant="contained"
            onClick={handleStartClick}
          >
            Start
          </Button>
        )}
      </Grid>
    </div>
  )
}
