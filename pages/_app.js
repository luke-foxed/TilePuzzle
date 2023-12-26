import Head from 'next/head'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider } from '@emotion/react'
import { SnackbarProvider } from 'notistack'
import { AuthUserProvider } from '../src/context/userProvider'
import createEmotionCache from '../styles/theme/createEmotionCache'
import theme from '../styles/theme/index'
import Navbar from '../src/components/navbar'
import '../styles/globals.css'
import StyledSnackbar from '../styles/theme/snackbar'
import { MobileProvider } from '../src/context/mobileContext'

const clientSideEmotionCache = createEmotionCache()

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <AuthUserProvider>
        <SnackbarProvider
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          Components={{ success: StyledSnackbar, error: StyledSnackbar }}
        >
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <MobileProvider>
              <Navbar />
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <Component {...pageProps} />
            </MobileProvider>
          </ThemeProvider>
        </SnackbarProvider>
      </AuthUserProvider>
    </CacheProvider>
  )
}
