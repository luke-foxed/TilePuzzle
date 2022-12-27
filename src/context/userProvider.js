import { createContext, useContext } from 'react'
import useFirebaseAuth from '../hooks/useFirebaseAuth'

const AuthUserContext = createContext({
  authUser: null,
  loading: true,
  createUser: async () => {},
  login: async () => {},
  logout: async () => {},
})

export function AuthUserProvider({ children }) {
  const auth = useFirebaseAuth()
  return <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
}
// custom hook to use the authUserContext and access authUser and loading
export const useAuth = () => useContext(AuthUserContext)
