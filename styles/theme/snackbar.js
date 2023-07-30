import { MaterialDesignContent } from 'notistack'
import { styled } from '@mui/material'

const styles = {
  backgroundColor: '#202C5A',
  height: '60px',
  padding: '0 14px 0 0',
  '#notistack-snackbar': {
    padding: '0px !important',
  },
  svg: {
    height: '60px !important',
    width: '60px !important',
    padding: '10px',
    marginInlineEnd: '14px !important',
  },
}

const StyledSnackbar = styled(MaterialDesignContent)(() => ({
  '&.notistack-MuiContent-success': { ...styles, svg: { ...styles.svg, backgroundColor: '#20FC8F' } },
  '&.notistack-MuiContent-error': { ...styles, svg: { ...styles.svg, backgroundColor: '#F75590' } },
}))

export default StyledSnackbar
