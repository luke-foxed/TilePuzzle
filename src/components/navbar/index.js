import { AppBar, Grid, styled, Typography } from '@mui/material'

const StyledTopBar = styled(AppBar)({
  height: '180px',
  background: 'none',
  color: 'black',
  boxShadow: 'none',
})

const Navbar = ({}) => {
  return (
    <StyledTopBar position="static">
      <Grid container alignItems="center" style={{ height: '100%', width: '85%', margin: 'auto'}}>
        <Grid item xs="auto" md={8} spacing={4}>
          <Typography variant="h1">Tiled</Typography>
        </Grid>
        <Grid item md={2} />
        <Grid item md={2} />
      </Grid>
    </StyledTopBar>
  )
}

export default Navbar
