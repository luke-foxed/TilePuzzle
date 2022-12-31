import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#202C5A',
    },
    secondary: {
      main: '#30BCED',
    },
    background: {
      default: '#171F40',
      paper: '#202C5A',
    },
    error: {
      main: '#F75590',
    },
    success: {
      main: '#20FC8F',
    },
  },
  typography: {
    body: {
      color: '#FFFBFE',
    },
    h1: {
      color: '#FFFBFE',
    },
    h2: {
      color: '#FFFBFE',
    },
    h3: {
      color: '#FFFBFE',
    },
    h4: {
      color: '#FFFBFE',
    },
    h5: {
      color: '#FFFBFE',
    },
    h6: {
      color: '#FFFBFE',
    },
  },
})

export default theme
