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

const BASE_URL = process.env.VERCEL_URL || 'http://localhost:3000'

export async function getStaticProps() {
  console.log('BASE URLLLLLLL', `${BASE_URL}/api/gradients`)
  const res = await fetch(`${BASE_URL}/api/gradients`)
  const gradientData = await res.json()

  return {
    props: {
      gradientData,
    },
  }
}

export default Gradients
