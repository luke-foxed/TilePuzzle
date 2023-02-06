import { useSortable, arraySwap } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function getNewIndex({ id, items, activeIndex, overIndex }) {
  return arraySwap(items, overIndex, activeIndex).indexOf(id)
}

export default function Tile({ tile }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: tile.id,
    getNewIndex,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <img src={tile.image} alt="tile" ref={setNodeRef} style={style} {...attributes} {...listeners} />
  )
}
