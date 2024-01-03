import Head from 'next/head'
import { Paper, Typography, styled, lighten } from '@mui/material'
import { Fragment, useContext } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import Image from 'next/image'
import Link from 'next/link'
import { ViewModule } from '@mui/icons-material'
import { MobileContext } from '../src/context/mobileProvider'
import { StyledHeader } from '../src/components/shared'

const StyledBox = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  padding: '20px',
  margin: 'auto',
  gap: '20px',
  alignItems: 'center',
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
  const { isMobile } = useContext(MobileContext)
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
          <StyledHeader size={isMobile ? 'h4' : 'h3'} icon={ViewModule}>
            Game Modes
          </StyledHeader>

          <Grid container spacing={10} justifyContent="center" style={{ margin: '0px 20px' }}>
            <Grid xs={12} sm={5}>
              <Link style={{ textDecoration: 'none', pointerEvents: 'none' }} href="/gradients">
                <StyledBox>
                  <Image src="/ordered.png" width={150} height={150} style={{ margin: 'auto' }} />
                  <Typography variant={isMobile ? 'h5' : 'h4'}>SLIDE</Typography>
                  {/* <Typography variant="h6">Slide tiles into the correct order</Typography> */}
                  <Typography variant="h6" sx={{ textAlign: 'center' }}>
                    Disabled - Coming Soon (Maybe)
                  </Typography>
                </StyledBox>
              </Link>
            </Grid>

            <Grid xs={12} sm={5}>
              <Link style={{ textDecoration: 'none' }} href="/gradients">
                <StyledBox>
                  <Image src="/scrambled.png" width={150} height={150} style={{ margin: 'auto' }} />
                  <Typography variant={isMobile ? 'h5' : 'h4'}>UNSCRAMBLE</Typography>
                  <Typography variant="h6" sx={{ textAlign: 'center' }}>
                    Drag tiles into the correct order
                  </Typography>
                </StyledBox>
              </Link>
            </Grid>
          </Grid>
        </div>
      </main>
    </>
  )
}
