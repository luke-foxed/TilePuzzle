import Head from 'next/head'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider } from '@emotion/react'
import { getSelectorsByUserAgent } from 'react-device-detect'
import { useEffect, useState } from 'react'
import { AuthUserProvider } from '../src/context/userProvider'
import createEmotionCache from '../styles/theme/createEmotionCache'
import theme from '../styles/theme/index'
import Navbar from '../src/components/navbar'
import '../styles/globals.css'

const clientSideEmotionCache = createEmotionCache()

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  const [mobileView, setMobileView] = useState(null)

  // the rest of the pages are rendered server-side and don't have 'access' to navigator
  // so using naviagator here to determine if the screen is a mobile, then passing it as a prop
  useEffect(() => {
    const agent = navigator.userAgent
    const { isMobile } = getSelectorsByUserAgent(agent)
    setMobileView(isMobile)
  }, [])

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <AuthUserProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navbar isMobile={mobileView} />
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} isMobile={mobileView} />
        </ThemeProvider>
      </AuthUserProvider>
    </CacheProvider>
  )
}
