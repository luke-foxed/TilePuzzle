import { Grid, styled } from '@mui/material'
import Link from 'next/link'
import { getGradients } from '../api/gradients'

const GradientLink = styled('div')({
  padding: '10px',
  height: '200px',
  width: '200px',
  img: {
    height: '100%',
    width: '100%',
    objectFit: 'cover',
    borderRadius: '20px',
  },
})

function Gradients({ gradientData }) {
  return (
    <div className="root">
      <Grid container key={gradientData.id}>
        {gradientData.map((gradient) => (
          <GradientLink>
            <Link href={`gradients/${gradient.id}`} key={gradient.id}>
              <img src={gradient.url} alt="gradient" />
            </Link>
          </GradientLink>
        ))}
      </Grid>
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
