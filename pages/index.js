import Head from 'next/head'
import { Button, Paper, Typography, styled, lighten } from '@mui/material'
import { Fragment } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import Image from 'next/image'
import Link from 'next/link'

const StyledBox = styled(Paper)(({ theme }) => ({
  padding: '20px',
  display: 'grid',
  gridTemplateRows: 'auto 50px 50px auto auto',
  gap: '20px',
  alignItems: 'center',
  width: '100%',
  h6: {
    fontWeight: '100',
  },
  'h4, h6': {
    margin: 'auto',
  },
  '&:hover': {
    backgroundColor: lighten(theme.palette.background.paper, 0.05),
  },
}))

export default function Home() {
  // const [image, setImage] = useState(null)
  // const [gameStarted, setGameStarted] = useState(false)

  // const handleImageSelect = (e) => {
  //   setImage(e.target.files[0])
  // }

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
            <Grid xs={12} md="auto" p={8}>
              <Link style={{ textDecoration: 'none' }} href="/gradients">
                <Button>
                  <StyledBox>
                    <Image src="/ordered.png" width={150} height={150} style={{ margin: 'auto' }} />
                    <Typography variant="h4">Slide</Typography>
                    <Typography variant="h6">Slide tiles into the correct order</Typography>
                  </StyledBox>
                </Button>
              </Link>
            </Grid>

            <Grid xs={12} md="auto" p={8}>
              <Link style={{ textDecoration: 'none' }} href="/gradients">
                <Button>
                  <StyledBox>
                    <Image
                      src="/scrambled.png"
                      width={150}
                      height={150}
                      style={{ margin: 'auto' }}
                    />
                    <Typography variant="h4">Unscramble</Typography>
                    <Typography variant="h6">Drag tiles into the correct order</Typography>
                  </StyledBox>
                </Button>
              </Link>
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
