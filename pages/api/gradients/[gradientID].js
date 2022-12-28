import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../config/firebase'

export default async function handler(req, res) {
  const { gradientID } = req.query
  const docRef = doc(db, 'gradients', gradientID)
  const docSnap = await getDoc(docRef)
  const gradient = await docSnap.data()
  res.status(200).json(gradient)
}
