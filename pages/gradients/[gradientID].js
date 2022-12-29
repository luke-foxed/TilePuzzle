import { getGradients } from '../api/gradients'
import { getGradient } from '../api/gradients/[gradientID]'

function Gradient({ gradientData }) {
  return (
    <div key={gradientData.id}>
      <img src={gradientData.url} alt="gradient" key={gradientData.id} width="200" />
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
    console.log('ERROR IN STATIC PATHS', error)
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
