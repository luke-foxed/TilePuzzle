import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useState, useEffect } from 'react'
import { auth, db } from '../../config/firebase'

// NOTE: firebase solution from https://blog.logrocket.com/implementing-authentication-in-next-js-with-firebase/

// for creating DB association with user
const createUserDocument = async (user) => {
  const { uid, email, displayName } = user
  const data = {
    displayName,
    email,
    avatar: `https://source.boringavatars.com/beam/120/${uid}?colors=FFFBFE,30BCED`,
  }
  await setDoc(doc(db, 'users', uid), data)
  return data
}

const getUserDocument = async (user) => {
  const { uid } = user
  const docRef = doc(db, 'users', uid)
  const docSnap = await getDoc(docRef)
  return docSnap.data()
}

const checkUserDocument = async (user) => {
  let userDoc = await getUserDocument(user)
  if (!userDoc) {
    userDoc = await createUserDocument(user)
  }
  return userDoc
}

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await checkUserDocument(user).then((data) => setAuthUser(data))
      } else {
        setAuthUser(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // API specific functions
  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password).catch((err) => {
      throw err
    })
  }

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const createUser = async (email, password) => {
    let { user } = await createUserWithEmailAndPassword(auth, email, password)
    if (user) {
      if (!user.displayName) {
        user = { ...user, displayName: email.split('@')[0] }
      }
      await createUserDocument(user)
    }
  }

  const logout = () => {
    signOut(auth)
  }

  return {
    authUser,
    loading,
    login,
    loginWithGoogle,
    logout,
    createUser,
  }
}
