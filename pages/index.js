import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { Button, Grid, Typography } from '@mui/material'
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'
import { mouseDownListener, mouseUpListener, objectMovingListener } from '../src/utils/canvasHelpers'
import Canvas from '../src/components/canvas'

export default function Home() {
  const [image, setImage] = useState(null)
  const [gameStarted, setGameStarted] = useState(false)

  const handleImageSelect = (e) => {
    setImage(e.target.files[0])
  }

  return (
    <>
      <Head>
        <title>Tiled</title>
        <meta name="description" content="Tiled by Luke Fox" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Grid container justifyContent="center" style={{ width: '85%', margin: 'auto' }} spacing={4}>
          <Grid item>
            <Button component="label" variant="contained" style={{ width: '240px' }} size="large">
              Upload Image
              <input hidden type="file" onChange={handleImageSelect} />
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" style={{ width: '240px' }} size="large">
              Generate Gradient
            </Button>
          </Grid>
        </Grid>
        <div>
          {image && (
            <Grid direction="column" container justifyContent="center" alignItems="center">
              <Canvas imageStuff={image} gameStarted={gameStarted} onGameStart={() => setGameStarted(true)} />
            </Grid>
          )}
        </div>
      </main>
    </>
  )
}
