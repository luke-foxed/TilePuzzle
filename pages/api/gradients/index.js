import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../../config/firebase'

export async function getGradients() {
  const gradients = []
  const querySnapshot = await getDocs(collection(db, 'gradients'))

  querySnapshot.forEach((doc) => {
    gradients.push({
      ...doc.data(),
      id: doc.id,
    })
  })

  return gradients
}

export default async (req, res) => {
  const gradients = await getGradients()
  res.status(200).json(gradients)
}
