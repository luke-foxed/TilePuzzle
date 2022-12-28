import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../../config/firebase'

export default async function handler(req, res) {
  const document = []
  if (req.method === 'GET') {
    const querySnapshot = await getDocs(collection(db, 'gradients'))

    querySnapshot.forEach((doc) => {
      document.push({
        ...doc.data(),
        id: doc.id,
      })
    })
  }
  res.status(200).json(document)
}
