import { createContext, useEffect, useMemo, useState } from 'react'
import { getSelectorsByUserAgent } from 'react-device-detect'

export const MobileContext = createContext({
  isMobile: false,
})

export function MobileProvider({ children }) {
  const [mobileView, setMobileView] = useState(null)

  // the rest of the pages are rendered server-side and don't have 'access' to navigator
  // so using naviagator here to determine if the screen is a mobile, then passing it as a prop
  useEffect(() => {
    const agent = navigator.userAgent
    const { isMobile } = getSelectorsByUserAgent(agent)
    setMobileView(isMobile)
  }, [])

  const memoizedIsMobile = useMemo(() => ({ isMobile: mobileView }), [mobileView])

  return <MobileContext.Provider value={memoizedIsMobile}>{children}</MobileContext.Provider>
}
