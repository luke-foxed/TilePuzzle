/* eslint-disable react/jsx-props-no-spreading */
import { useSortable, arraySwap } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Lock } from '@mui/icons-material'
import { Box } from '@mui/material'
import { useEffect, useState } from 'react'

function getNewIndex({ id, items, activeIndex, overIndex }) {
  return arraySwap(items, overIndex, activeIndex).indexOf(id)
}

export default function Tile({ tile }) {
  const { id, height, width, locked, image } = tile
  const [isVisible, setIsVisible] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    getNewIndex,
  })

  useEffect(() => {
    const delay = id * 50
    const animationTimeout = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    return () => clearTimeout(animationTimeout)
  }, [id])

  const style = {
    touchAction: 'none',
    zIndex: isDragging ? 1 : 'unset', // Higher z-index for the tile being dragged
    transform: CSS.Transform.toString(transform),
    transition: `${isVisible ? `${transition}, opacity 0.5s` : ''}`,
    opacity: isVisible ? 1 : 0,
    boxShadow: isDragging ? '0px 4px 10px rgba(0, 0, 0, 0.3)' : '', // Add drop shadow when tile is dragged
  }

  const tileHoverStyle = !locked && {
    '&:hover': { outline: '1px solid rgba(0,0,0,0.3)', outlineOffset: '-1px' },
  }

  return (
    <Box
      ref={locked ? null : setNodeRef}
      style={{ ...style, height, cursor: locked ? 'default' : 'grab' }}
      sx={tileHoverStyle}
      {...attributes}
      {...listeners}
    >
      {locked && (
        <div style={{ position: 'absolute', width, height }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Lock />
          </div>
        </div>
      )}
      <img src={image} alt="tile" />
    </Box>
  )
}
