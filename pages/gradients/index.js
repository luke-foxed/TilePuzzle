import { Grid, Typography, styled } from '@mui/material'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import { SquareLoader } from 'react-spinners'
import { getGradients } from '../api/gradients'
import { generateThumbnail } from '../../src/utils/dndHelper'
import { MobileContext } from '../../src/context/mobileContext'

const GradientThumbnail = styled('img')({
  border: '4px dashed #202C5A',
  padding: '10px',
})

function Gradients({ gradientData }) {
  const [gradientsWithImages, setGradientsWithImages] = useState([])
  const [loading, setLoading] = useState(true)
  const { isMobile } = useContext(MobileContext)

  useEffect(() => {
    const getThumbnails = async () => {
      const thumbnails = await Promise.all(
        gradientData.map(async (gradient) => {
          const thumbnail = await generateThumbnail(gradient.colors)
          return { ...gradient, image: thumbnail }
        }),
      )

      setGradientsWithImages(thumbnails)
      setLoading(false)
    }

    getThumbnails()
  }, [gradientData, isMobile])

  return (
    <div className="root">
      {loading ? (
        <SquareLoader />
      ) : (
        <Grid container>
          {gradientsWithImages.map((gradient) => (
            <Grid container item xs={6} sm={3} alignItems="center" justifyContent="center">
              <Link href={`gradients/${gradient.id}`} style={{ textDecoration: 'none' }}>
                <GradientThumbnail
                  style={{ height: isMobile ? 100 : 200, width: isMobile ? 100 : 200 }}
                  src={gradient.image}
                  alt="gradient"
                />
                <Typography
                  variant={isMobile ? 'h6' : 'h5'}
                  style={{ textAlign: 'center', textTransform: 'uppercase' }}
                >
                  Level
                  {' '}
                  {gradient.level}
                </Typography>
              </Link>
            </Grid>
          ))}
        </Grid>
      )}
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
