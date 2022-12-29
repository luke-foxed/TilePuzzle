import Link from 'next/link'
import { getGradients } from '../api/gradients'

function Gradients({ gradientData }) {
  return (
    <div>
      {gradientData.map((gradient) => (
        <Link href={`gradients/${gradient.id}`} key={gradient.id}>
          <img src={gradient.url} alt="gradient" width="200" />
        </Link>
      ))}
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
