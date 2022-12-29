import { Grid, styled } from '@mui/material'
import Link from 'next/link'
import { StyledContainer } from '../../src/components/shared'
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
    <StyledContainer key={gradientData.id}>
      <Grid container row>
        {gradientData.map((gradient) => (
          <GradientLink>
            <Link href={`gradients/${gradient.id}`} key={gradient.id}>
              <img src={gradient.url} alt="gradient" />
            </Link>
          </GradientLink>
        ))}
      </Grid>
    </StyledContainer>
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
