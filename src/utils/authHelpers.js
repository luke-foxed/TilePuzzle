// eslint-disable-next-line import/prefer-default-export
export const getAuthErrorMessage = (code) => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already in use'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters'
    default:
      console.log(code)
      return 'There was an error with this request'
  }
}
