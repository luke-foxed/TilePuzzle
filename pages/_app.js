import * as React from 'react'
import Head from 'next/head'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider } from '@emotion/react'
import { getSelectorsByUserAgent } from 'react-device-detect'
import App from 'next/app'
import { AuthUserProvider } from '../src/context/userProvider'
import createEmotionCache from '../styles/theme/createEmotionCache'
import theme from '../styles/theme/index'
import Navbar from '../src/components/navbar'

// Client-side cache shared for the whole session
// of the user in the browser.

const clientSideEmotionCache = createEmotionCache()

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps, isMobile } = props
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <AuthUserProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navbar />
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} isMobile={isMobile} />
        </ThemeProvider>
      </AuthUserProvider>
    </CacheProvider>
  )
}

// SSR means no way of detecting devices, so doing it here
MyApp.getInitialProps = async (context) => {
  const userAgent = context.ctx.req.headers['user-agent']
  const appProps = await App.getInitialProps(context)
  const { isMobile } = getSelectorsByUserAgent(userAgent)
  return { ...appProps, isMobile }
}
