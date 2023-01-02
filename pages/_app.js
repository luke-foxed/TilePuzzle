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

// Client-side cache shared for the whole session
// of the user in the browser.

const clientSideEmotionCache = createEmotionCache()

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  const [mobileView, setMobileView] = useState(false)

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
          <Navbar />
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} isMobile={mobileView} />
        </ThemeProvider>
      </AuthUserProvider>
    </CacheProvider>
  )
}
