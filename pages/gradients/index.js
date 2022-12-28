import Link from 'next/link'

function Gradients({ gradientData }) {
  return (
    <div>
      {gradientData.map((gradient) => (
        <Link href={`gradients/${gradient.id}`}>
          <img src={gradient.url} alt="gradient" key={gradient.id} width="200" />
        </Link>
      ))}
    </div>
  )
}

const BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000'
  : `https://${process.env.VERCEL_URL}`

export async function getStaticProps() {
  const res = await fetch(`${BASE_URL}/api/gradients`)
  const gradientData = await res.json()

  return {
    props: {
      gradientData,
    },
  }
}

export default Gradients
