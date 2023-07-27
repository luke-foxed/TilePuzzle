/* eslint-disable react/jsx-props-no-spreading */
import { useSortable, arraySwap } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Lock } from '@mui/icons-material'

function getNewIndex({ id, items, activeIndex, overIndex }) {
  return arraySwap(items, overIndex, activeIndex).indexOf(id)
}

export default function Tile({ tile }) {
  const { id, height, width, locked, image } = tile
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    getNewIndex,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={locked ? null : setNodeRef}
      style={{ ...style, height }}
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
    </div>
  )
}
