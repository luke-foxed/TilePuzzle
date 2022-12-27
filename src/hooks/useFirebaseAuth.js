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

// DB API CALLS
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

const formatAuthUser = (user) => ({
  uid: user.uid,
  email: user.email,
})

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const authStateChanged = (authState) => {
    if (!authState) {
      setAuthUser(null)
      setLoading(false)
      return
    }

    setLoading(true)
    const formattedUser = formatAuthUser(authState)
    setAuthUser(formattedUser)
    setLoading(false)
  }

  const clear = () => {
    setAuthUser(null)
    setLoading(true)
  }

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
    clear()
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged)
    return () => unsubscribe()
  }, [])

  return {
    authUser,
    loading,
    login,
    loginWithGoogle,
    logout,
    createUser,
  }
}
