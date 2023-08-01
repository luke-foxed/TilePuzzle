// eslint-disable-next-line import/prefer-default-export
export const getAuthErrorMessage = (code) => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already in use'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters'
    case 'auth/user-not-found':
      return 'Incorrect login details'
    case 'auth/wrong-password':
      return 'Incorrect login details'
    default:
      return 'There was an error with this request'
  }
}
