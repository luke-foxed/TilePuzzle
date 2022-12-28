import Link from 'next/link'

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

const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export async function getStaticProps() {
  let gradientData = []

  try {
    const res = await fetch(`${BASE_URL}/api/gradients`)
    gradientData = await res.json()
  } catch (error) {
    console.log('ERROR IN STATIC PROPS', error)
  }

  return {
    props: {
      gradientData,
    },
  }
}

export default Gradients
