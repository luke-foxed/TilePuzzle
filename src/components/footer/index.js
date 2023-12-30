import React, { useContext, useEffect, useState } from 'react'
import { Grid, Typography, styled } from '@mui/material'
import Image from 'next/image'
import { GitHub, LinkedIn } from '@mui/icons-material'
import Link from 'next/link'
import theme from '../../../styles/theme'
import { MobileContext } from '../../context/mobileProvider'

const StyledFooter = styled('footer')({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  height: '50px',
  textAlign: 'center',
})

export default function Footer() {
  const [marginTop, setMarginTop] = useState('50px') // Default margin top
  const { isMobile } = useContext(MobileContext)

  useEffect(() => {
    const contentHeight = window.innerHeight
    const pageHeight = document.body.offsetHeight

    if (pageHeight < contentHeight) {
      setMarginTop(contentHeight - (pageHeight - 50))
    }
  }, [])

  return (
    <StyledFooter style={{ marginTop }}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: '100%', opacity: '0.5', width: '75%', margin: 'auto' }}
      >
        <Grid
          container
          item
          xs={9}
          sm={6}
          alignItems="center"
          justifyContent="flex-start"
          gap="10px"
        >
          <Image src="/tile_icon.png" width={30} height={30} />
          <Typography variant={isMobile ? 'h7' : 'h4'}>TILED</Typography>
          <Typography variant={isMobile ? 'h7' : 'h6'}>
            {' '}
            by Luke Fox,
            {' '}
            {!isMobile && new Date().getFullYear()}
          </Typography>
        </Grid>
        <Grid container item xs={3} sm={6} alignItems="center" justifyContent="flex-end" gap="10px">
          <Link
            target="_blank"
            href="https://github.com/luke-foxed"
            style={{ textDecoration: 'none', color: '#fff', lineHeight: 0 }}
          >
            <GitHub />
          </Link>
          <Link
            target="_blank"
            href="https://www.linkedin.com/in/lukefox9/"
            style={{ textDecoration: 'none', color: '#fff', lineHeight: 0 }}
          >
            <LinkedIn />
          </Link>
        </Grid>
      </Grid>
    </StyledFooter>
  )
}
