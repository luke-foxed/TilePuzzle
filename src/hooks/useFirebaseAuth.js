// https://blog.logrocket.com/implementing-authentication-in-next-js-with-firebase/

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { addDoc, collection } from 'firebase/firestore'
import { useState, useEffect } from 'react'
import { auth, db } from '../../config/firebase'

const formatAuthUser = (user) => ({
  uid: user.uid,
  email: user.email,
})

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const userDB = collection(db, 'users')

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

  const createUser = async (email, password) => {
    const res = await createUserWithEmailAndPassword(auth, email, password)
    if (res.user) {
      await addDoc(userDB, { email }).catch((err) => console.log('ERR', err))
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
    logout,
    createUser,
  }
}
