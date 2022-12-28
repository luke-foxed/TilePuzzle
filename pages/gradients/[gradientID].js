function Gradient({ gradientData }) {
  return (
    <div key={gradientData.id}>
      <img src={gradientData.url} alt="gradient" key={gradientData.id} width="200" />
    </div>
  )
}

const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export async function getStaticPaths() {
  let paths = []
  try {
    const res = await fetch(`${BASE_URL}/api/gradients`)
    if (res.ok) {
      const gradients = await res.json()
      paths = gradients.map((gradient) => ({
        params: { gradientID: gradient.id },
      }))
    }

    return { paths, fallback: false }
  } catch (error) {
    console.log('ERROR IN STATIC PATHS', error)
    return { paths, fallback: false }
  }
}

export async function getStaticProps({ params }) {
  const id = params.gradientID
  const res = await fetch(`${BASE_URL}/api/gradients/${id}`)
  const gradientData = await res.json()

  return {
    props: {
      gradientData,
    },
  }
}

export default Gradient
