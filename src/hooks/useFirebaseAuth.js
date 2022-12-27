// https://blog.logrocket.com/implementing-authentication-in-next-js-with-firebase/

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

// for creating DB association with user
const createUserDocument = async (user) => {
  const { uid, email } = user
  await setDoc(doc(db, 'users', uid), {
    email,
  })
}

const checkUserDocument = async (user) => {
  const { uid } = user
  const docRef = doc(db, 'users', uid)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) {
    await createUserDocument(user)
  }
}

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const formattedUser = user ? { uid: user.uid, email: user.email } : null
      setAuthUser(formattedUser)
    })
    return () => unsubscribe()
  }, [])

  // API specific functions
  const login = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password)
    return res
  }

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const { user } = await signInWithPopup(auth, provider)
    await checkUserDocument(user)
  }

  const createUser = async (email, password) => {
    const res = await createUserWithEmailAndPassword(auth, email, password)
    if (res.user) {
      await createUserDocument(res.user)
    }
    return res
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
