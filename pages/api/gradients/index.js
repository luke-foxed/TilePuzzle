import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../../config/firebase'

export const getGradients = async () => {
  const gradients = []
  const querySnapshot = await getDocs(collection(db, 'gradients'))

  querySnapshot.forEach((doc) => {
    gradients.push({
      ...doc.data(),
      id: doc.id,
    })
  })

  // Sort gradients based on the 'level' field
  gradients.sort((a, b) => a.level - b.level)

  return gradients
}

export default async (req, res) => {
  const gradients = await getGradients()
  res.status(200).json(gradients)
}
