import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../../config/firebase'

export async function getGradient(id) {
  const docRef = doc(db, 'gradients', id)
  const docSnap = await getDoc(docRef)
  const gradient = await docSnap.data()
  return { ...gradient, id }
}

export default async (req, res) => {
  const { method, query, body } = req
  if (method === 'POST') {
    try {
      const gradientDoc = await doc(db, 'gradients', query.gradientID)
      await updateDoc(gradientDoc, { scores: arrayUnion(body) })
      res.status(200).json({ msg: 'Score saved' })
    } catch (error) {
      res.status(500).json({ msg: 'Error saving score', error })
    }
  }
  if (method === 'GET') {
    try {
      const docRef = doc(db, 'gradients', query.gradientID)
      const docSnap = await getDoc(docRef)
      const gradient = await docSnap.data()
      res.status(200).json({ ...gradient, id: query.id })
    } catch (error) {
      res.status(500).json({ msg: 'Error getting gradient', error })
    }
  }
}
