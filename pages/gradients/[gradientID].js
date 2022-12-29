import { Grid } from '@mui/material'
import { useState } from 'react'
import Canvas from '../../src/components/canvas'
import { getGradients } from '../api/gradients'
import { getGradient } from '../api/gradients/[gradientID]'

function Gradient({ gradientData }) {
  const [gameStarted, setGameStarted] = useState(false)
  return (
    <div key={gradientData.id}>
      {gradientData.url && (
        <Grid direction="row" container justifyContent="center" alignItems="center">
          <Canvas
            imageInput={gradientData.url}
            gameStarted={gameStarted}
            onGameToggle={(toggle) => setGameStarted(toggle)}
          />
        </Grid>
      )}
    </div>
  )
}

export async function getStaticPaths() {
  let paths = []
  try {
    const gradients = await getGradients()

    paths = gradients.map((gradient) => ({
      params: { gradientID: gradient.id },
    }))

    return { paths, fallback: false }
  } catch (error) {
    return { paths, fallback: false }
  }
}

export async function getStaticProps({ params }) {
  const id = params.gradientID
  const gradientData = await getGradient(id)

  return {
    props: {
      gradientData,
    },
  }
}

export default Gradient
