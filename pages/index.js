import Head from 'next/head'
import { Button, Grid } from '@mui/material'
import { Fragment, useState } from 'react'
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
        <Grid
          container
          justifyContent="center"
          style={{ width: '85%', margin: 'auto' }}
          spacing={4}
        >
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
            <Grid direction="row" container justifyContent="center" alignItems="center">
              <Canvas
                imageInput={image}
                gameStarted={gameStarted}
                onGameToggle={(toggle) => setGameStarted(toggle)}
              />
            </Grid>
          )}
        </div>
      </main>
    </>
  )
}
