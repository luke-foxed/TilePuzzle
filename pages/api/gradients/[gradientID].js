import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../config/firebase'

export async function getGradient(id) {
  const docRef = doc(db, 'gradients', id)
  const docSnap = await getDoc(docRef)
  const gradient = await docSnap.data()
  return gradient
}

export default async function handler(req, res) {
  const { gradientID } = req.query
  const gradient = await getGradient(gradientID)
  res.status(200).json(gradient)
}
