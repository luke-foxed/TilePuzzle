function Gradient({ gradientData }) {
  return (
    <div>
      <img src={gradientData.url} alt="gradient" key={gradientData.id} width="200" />
    </div>
  )
}

export async function getStaticPaths() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/gradients`)
  const gradients = await res.json()
  const paths = gradients.map((gradient) => ({
    params: { gradientID: gradient.id },
  }))

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const id = params.gradientID
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/gradients/${id}`)
  const gradientData = await res.json()

  return {
    props: {
      gradientData,
    },
  }
}

export default Gradient
