/* eslint-disable no-console */
const { getFirestore, collection, getDocs, deleteDoc, doc } = require('firebase/firestore')
const { initializeApp } = require('firebase/app')
require('dotenv').config({ path: '.env.local' })

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const deleteAllDocumentsInCollection = async () => {
  try {
    // Get all documents in the 'gradients' collection
    const querySnapshot = await getDocs(collection(db, 'gradients'))

    // Delete each document
    querySnapshot.forEach(async (d) => {
      await deleteDoc(doc(db, 'gradients', d.id))
      console.log(`Document with ID ${d.id} deleted successfully.`)
    })

    console.log('All documents in the collection deleted successfully.')
  } catch (error) {
    console.error('Error deleting documents:', error)
  }
}

// Run the script to delete all documents in the 'gradients' collection
deleteAllDocumentsInCollection()
