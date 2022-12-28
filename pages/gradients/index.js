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

export async function getStaticProps() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/gradients`)
  const gradientData = await res.json()

  return {
    props: {
      gradientData,
    },
  }
}

export default Gradients
