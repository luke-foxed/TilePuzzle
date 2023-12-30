import { Grid, Typography, Button, styled, Box } from '@mui/material'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { getGradients } from '../api/gradients'
import { generateThumbnail } from '../../src/utils/dndHelper'
import { MobileContext } from '../../src/context/mobileProvider'

const GradientThumbnail = styled('img', { shouldForwardProp: (props) => props !== 'isMobile' })(
  ({ isMobile }) => ({
    border: '4px dashed #202C5A',
    padding: '10px',
    height: isMobile ? 150 : 200,
    width: isMobile ? 150 : 200,
  }),
)

const GradientOverlay = styled('div', { shouldForwardProp: (props) => props !== 'hovered' })(
  ({ hovered }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: hovered ? 'rgba(23, 31, 64, 0.9)' : 'none',
    backdropFilter: hovered ? 'blur(4px)' : 'none',
    border: '4px dashed #202C5A',
    transition: 'all 0.3s ease',
    '*': {
      opacity: hovered ? '1.0' : '0',
    },
  }),
)

const GradientOverlayBox = styled(Box)({
  color: '#fff',
  position: 'absolute',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  justifyContent: 'center',
})

function Tile({ gradient }) {
  const [hovered, setHovered] = useState(false)
  const { isMobile } = useContext(MobileContext)
  const { id, image, level, difficulty } = gradient

  const GradientLink = isMobile ? Box : Link

  return (
    <Grid container direction="column" item xs={6} sm={3} spacing={2}>
      <Grid container item alignItems="center" justifyContent="center">
        <GradientLink
          href={`gradients/${id}`}
          style={{ textDecoration: 'none', position: 'relative', display: 'flex' }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <GradientOverlay hovered={hovered}>
            <GradientOverlayBox>
              <Typography
                variant={isMobile ? 'h8' : 'h6'}
                style={{ textAlign: 'center', textTransform: 'uppercase' }}
              >
                Difficulty:
                {' '}
                {difficulty}
              </Typography>
              {isMobile && hovered && (
                <Link href={`gradients/${id}`}>
                  <Button color="success">Play</Button>
                </Link>
              )}
            </GradientOverlayBox>
          </GradientOverlay>
          <GradientThumbnail src={image} alt="gradient" isMobile={isMobile} />
        </GradientLink>
      </Grid>
      <Grid container item alignItems="center" justifyContent="center">
        <Typography
          variant={isMobile ? 'h6' : 'h5'}
          style={{ textAlign: 'center', textTransform: 'uppercase' }}
        >
          Level
          {' '}
          {level}
        </Typography>
      </Grid>
    </Grid>
  )
}

function Gradients({ gradientData }) {
  const { isMobile } = useContext(MobileContext)

  const gradientsWithThumbnails = gradientData.map((gradient) => {
    const thumbnail = generateThumbnail(gradient.colors)
    return { ...gradient, image: thumbnail }
  })

  return (
    <div className="root">
      <Grid container rowGap={2} style={{ margin: '20px 0' }}>
        {gradientsWithThumbnails.map((gradient) => (
          <Tile gradient={gradient} key={gradient.id} />
        ))}
      </Grid>
      <Typography
        variant={isMobile ? 'h6' : 'h5'}
        style={{ textAlign: 'center', textTransform: 'uppercase', padding: '20px' }}
      >
        More Levels Coming Soon (Maybe)
      </Typography>
    </div>
  )
}

export async function getStaticProps() {
  let gradientData = []

  try {
    gradientData = await getGradients()
  } catch (error) {
    throw new Error(error)
  }

  return {
    props: {
      gradientData,
    },
  }
}

export default Gradients
