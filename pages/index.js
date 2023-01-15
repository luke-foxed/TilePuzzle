import Head from 'next/head'
import { Button, Paper, Typography, Box, styled } from '@mui/material'
import { Fragment } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  // const [image, setImage] = useState(null)
  // const [gameStarted, setGameStarted] = useState(false)

  // const handleImageSelect = (e) => {
  //   setImage(e.target.files[0])
  // }

  const StyledBox = styled(Box)(() => ({
    display: 'grid',
    gridTemplateRows: 'auto 50px 50px auto auto',
    gap: '10px',
    alignItems: 'center',
    width: '100%',
    h6: {
      fontWeight: '100',
    },
    'h4, h6': {
      margin: 'auto',
    },
  }))

  return (
    <>
      <Head>
        <title>Tiled</title>
        <meta name="description" content="Tiled by Luke Fox" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="root">
          <Typography variant="h3">Choose A Game Mode</Typography>

          <Grid container spacing={10} sx={{ marginTop: '10px' }} justifyContent="center">
            <Grid xs={12} md={4} p={8}>
              <Paper sx={{ padding: '20px', borderRadius: '20px' }}>
                <StyledBox>
                  <Image src="/ordered.png" width={150} height={150} style={{ margin: 'auto' }} />
                  <Typography variant="h4">Slide</Typography>
                  <Typography variant="h6">Slide tiles into the correct order</Typography>
                  <Link style={{ textDecoration: 'none' }} href="/gradients">
                    <Button color="success" variant="contained" size="large" fullWidth>
                      Browse Levels
                    </Button>
                  </Link>
                  <Button color="success" size="large">
                    Create A Level
                  </Button>
                </StyledBox>
              </Paper>
            </Grid>
            <Grid xs={12} md={4} p={8}>
              <Paper sx={{ padding: '20px', borderRadius: '20px' }}>
                <StyledBox>
                  <Image src="/scrambled.png" width={150} height={150} style={{ margin: 'auto' }} />
                  <Typography variant="h4">Unscramble</Typography>
                  <Typography variant="h6">Drag tiles into the correct order</Typography>
                  <Link style={{ textDecoration: 'none' }} href="/gradients">
                    <Button color="success" variant="contained" size="large" fullWidth>
                      Browse Levels
                    </Button>
                  </Link>
                  <Button color="success" size="large">
                    Create A Level
                  </Button>
                </StyledBox>
              </Paper>
            </Grid>
          </Grid>

          {/* <Grid container justifyContent="center" spacing={4}>
            <Grid item>
              <Button component="label" variant="contained" sx={{ width: '240px' }} size="large">
                Upload Image
                <input hidden type="file" onChange={handleImageSelect} />
              </Button>
            </Grid>
            <Grid item>
              <Link sx={{ textDecoration: 'none' }} href="/gradients">
                <Button variant="contained" sx={{ width: '240px' }} size="large">
                  Browse Levels
                </Button>
              </Link>
            </Grid>
          </Grid> */}
          {/* {image && (
              <Grid direction="row" container justifyContent="center" alignItems="center">
                <Canvas
                  img={image}
                  gameStarted={gameStarted}
                  onGameToggle={(toggle) => setGameStarted(toggle)}
                />
              </Grid>
            )} */}
        </div>
      </main>
    </>
  )
}
