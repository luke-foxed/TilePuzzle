import { createContext } from 'react'
import useFirebaseAuth from '../hooks/useFirebaseAuth'

export const AuthUserContext = createContext({
  authUser: null,
  loading: true,
  createUser: async () => {},
  login: async () => {},
  logout: async () => {},
  loginWithGoogle: async () => {},
})

export function AuthUserProvider({ children }) {
  const auth = useFirebaseAuth()
  return <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
}
