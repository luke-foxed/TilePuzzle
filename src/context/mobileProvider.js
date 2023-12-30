import { createContext, useEffect, useMemo, useState } from 'react'
import { getSelectorsByUserAgent } from 'react-device-detect'

export const MobileContext = createContext({
  isMobile: false,
})

export function MobileProvider({ children }) {
  const [mobileView, setMobileView] = useState(null)

  const handleResize = () => {
    const agent = navigator.userAgent
    const { isMobile } = getSelectorsByUserAgent(agent)
    if (isMobile || window.innerWidth < 1000) {
      setMobileView(true)
    } else {
      setMobileView(false)
    }
  }

  useEffect(() => {
    // Initialize the state based on the initial window width
    handleResize()

    // Add a resize event listener to update the state on window resize
    window.addEventListener('resize', handleResize)

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const memoizedIsMobile = useMemo(() => ({ isMobile: mobileView }), [mobileView])

  return <MobileContext.Provider value={memoizedIsMobile}>{children}</MobileContext.Provider>
}
