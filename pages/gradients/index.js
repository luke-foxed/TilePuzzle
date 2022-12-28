function Gradients({ gradientData }) {
  return (
    <div>
      {gradientData.map((gradient) => (
        <img src={gradient.url} alt="gradient" key={gradient.id} width="200" />
      ))}
    </div>
  )
}

export async function getStaticProps() {
  const res = await fetch('http://localhost:3000/api/gradients')
  const gradientData = await res.json()

  return {
    props: {
      gradientData,
    },
  }
}

export default Gradients
