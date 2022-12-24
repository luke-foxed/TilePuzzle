import Head from 'next/head'
import { Inter } from '@next/font/google'
import { Button, Grid } from '@mui/material'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'
import { mouseDownListener, mouseUpListener, objectMovingListener } from '../../utils/canvasHelpers'
import { generateTiles, jumbleTiles, swapTiles } from '../../utils/tileHelpers'

export default function Canvas({ imageStuff, gameStarted, onGameToggle }) {
  const canvasRef = useRef()
  const [canvas, setCanvas] = useState(null)
  const [canvasState, setCanvasState] = useState(null)
  const [correctOrder, setCorrectOrder] = useState([])

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
        alert('WINNER')
      }
    }
  }, [canvas, canvasState, correctOrder])

  useEffect(() => {
    if (canvas) {
      const ctx = canvas.getContext('2d')
      let img = new Image()
      img.src = URL.createObjectURL(imageStuff)
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
  }, [canvas, imageStuff])

  const handleStartClick = () => {
    generateTiles(1, 3, 3, canvas)

    // clear the background image after we've added some tiles
    const image = new fabric.Image('')
    canvas.setBackgroundImage(image, canvas.renderAll.bind(canvas))

    onGameToggle(true)

    // set the correct order of tiles (it is hardcoded to 16 for now)
    setCorrectOrder([...Array(9).keys()])

    // wait a second before beginning shuffle
    setTimeout(() => {
      jumbleTiles([...Array(9).keys()], canvas)
    }, 2000)
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
  }

  const updateCurrentOrder = () => {
    const order = canvas.getObjects().map((obj) => obj.index)
    setCurrentOrder(order)
  }

  return (
    <div style={{ border: '1px solid #30BCED', margin: '20px' }}>
      <canvas ref={canvasRef} id="canvas" style={{ padding: '20px' }} />
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
    </div>
  )
}
