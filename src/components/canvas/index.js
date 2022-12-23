import Head from 'next/head'
import { Inter } from '@next/font/google'
import { Button, Grid } from '@mui/material'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'
import { mouseDownListener, mouseUpListener, objectMovingListener } from '../../utils/canvasHelpers'
import { generateTiles, swapTiles } from '../../utils/tileHelpers'

export default function Canvas({ imageStuff, gameStarted, onGameStart }) {
  const [canvas, setCanvas] = useState(null)
  const [correctOrder, setCorrectOrder] = useState([])

  useEffect(() => {
    setCanvas(new fabric.Canvas('canvas'), { selection: false })
  }, [])

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

    onGameStart()

    // set the correct order of tiles (it is hardcoded to 16 for now)
    setCorrectOrder([...Array(9).keys()])
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

  if (canvas) {
    // bit hacky, but fabric is attaching multiple instances of the same event listeners
    // need to limit this to just a single event listener to prevent duplicate events firing
    const listeners = canvas.__eventListeners
    if (listeners === undefined) {
      canvas.on('mouse:up', (event) => mouseUpListener(event, canvas))
      canvas.on('mouse:down', (event) => mouseDownListener(event))
      canvas.on('object:moving', (event) => objectMovingListener(event, canvas))
    }
  }

  return (
    <div style={{ border: '1px solid #30BCED', margin: '20px' }}>
      <canvas id="canvas" style={{ padding: '20px' }} />
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
