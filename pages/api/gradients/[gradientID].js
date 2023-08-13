import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../../config/firebase'

export async function getGradient(id) {
  const docRef = doc(db, 'gradients', id)
  const docSnap = await getDoc(docRef)
  const gradient = await docSnap.data()
  return { ...gradient, id }
}

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const gradientDoc = doc(db, 'gradients', req.query.gradientID)
      await updateDoc(gradientDoc, { scores: arrayUnion(req.body) })
      res.status(200).json({ msg: 'Score saved' })
    } catch (error) {
      res.status(500).json({ msg: 'Error saving score', error })
    }
  }
}
