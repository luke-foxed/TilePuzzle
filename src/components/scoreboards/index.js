import React, { useState, useMemo, useContext } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Typography,
  styled,
} from '@mui/material'
import Image from 'next/image'
import { Gamepad, Person, Timer, CalendarToday } from '@mui/icons-material'
import { MobileContext } from '../../context/mobileContext'

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) return -1
  if (b[orderBy] > a[orderBy]) return 1
  return 0
}

const timeComparator = (a, b, orderBy) => {
  const getTimeInSeconds = (time) => {
    const [minute, seconds] = time.split(':').map(Number)
    return minute * 60 + seconds
  }

  if (getTimeInSeconds(b[orderBy]) < getTimeInSeconds(a[orderBy])) return -1
  if (getTimeInSeconds(b[orderBy]) > getTimeInSeconds(a[orderBy])) return 1
  return 0
}

const dateComparator = (a, b, orderBy) => {
  const getDateValue = (date) => {
    const [dd, mm, yyyy] = date.split('/').map(Number)
    return new Date(yyyy, mm - 1, dd).getTime()
  }

  if (getDateValue(b[orderBy]) < getDateValue(a[orderBy])) return -1
  if (getDateValue(b[orderBy]) > getDateValue(a[orderBy])) return 1
  return 0
}

const getComparator = (order, orderBy) => {
  switch (orderBy) {
    case 'time':
      return order === 'desc'
        ? (a, b) => timeComparator(a, b, orderBy)
        : (a, b) => -timeComparator(a, b, orderBy)
    case 'date':
      return order === 'desc'
        ? (a, b) => dateComparator(a, b, orderBy)
        : (a, b) => -dateComparator(a, b, orderBy)
    default:
      return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy)
  }
}

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

const headCells = [
  {
    id: 'user',
    numeric: false,
    disablePadding: true,
    label: 'User',
    icon: <Person sx={{ color: '#fff' }} />,
  },
  {
    id: 'moves',
    numeric: true,
    disablePadding: false,
    label: 'Moves',
    icon: <Gamepad sx={{ color: '#fff' }} />,
  },
  {
    id: 'time',
    numeric: true,
    disablePadding: false,
    label: 'Time',
    icon: <Timer sx={{ color: '#fff' }} />,
  },
  {
    id: 'date',
    numeric: true,
    disablePadding: false,
    label: 'Date',
    icon: <CalendarToday sx={{ color: '#fff' }} />,
  },
]

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow sx={{ bgcolor: 'secondary.main' }}>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sx={{ padding: '20px', borderBottom: '1px solid rgba(0, 0, 0, 0.5)' }}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.icon}
              <Typography variant="h5" sx={{ padding: '0 10px' }}>{headCell.label}</Typography>
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

const EmptyScoreBox = styled(Box)(() => ({
  margin: '40px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}))

export default function Scoreboards({ scores }) {
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('moves')
  const { isMobile } = useContext(MobileContext)

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const visibleRows = useMemo(
    () => stableSort(scores, getComparator(order, orderBy)),
    [order, orderBy, scores],
  )

  if (!scores || !scores.length) {
    return (
      <EmptyScoreBox>
        <Image
          src="/empty_scoreboard.png"
          width={isMobile ? 120 : 180}
          height={isMobile ? 120 : 180}
          style={{ border: '4px dashed #202C5A', padding: '10px' }}
        />
        <Typography
          variant={isMobile ? 'h6' : 'h5'}
          style={{ textAlign: 'center', textTransform: 'uppercase', padding: '20px' }}
        >
          No Scores!
        </Typography>
      </EmptyScoreBox>
    )
  }

  return (
    <Box sx={{ width: '100%', height: '100%', marginTop: '50px' }}>
      <Paper sx={{ width: '100%' }}>
        <TableContainer>
          <Table sx={{ minWidth: 750, padding: '20px' }}>
            <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
            <TableBody>
              {visibleRows.map((row, index) => (
                <TableRow key={`${row.user}_${index + 1}`}>
                  <TableCell
                    scope="row"
                    padding="none"
                    sx={{ padding: '20px', borderBottom: '1px solid rgba(0, 0, 0, 0.5)' }}
                  >
                    <Typography variant="h6">{row.user}</Typography>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ padding: '20px', borderBottom: '1px solid rgba(0, 0, 0, 0.5)' }}
                  >
                    <Typography variant="h6">{row.moves}</Typography>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ padding: '20px', borderBottom: '1px solid rgba(0, 0, 0, 0.5)' }}
                  >
                    <Typography variant="h6">{row.time}</Typography>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ padding: '20px', borderBottom: '1px solid rgba(0, 0, 0, 0.5)' }}
                  >
                    <Typography variant="h6">{row.date}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}
