import { swapTiles, tileIsContained } from './tileHelpers'

export const mouseUpListener = (event) => {
  const { target } = event
  const { canvas } = target
  const initialPos = { x: event.transform.original.left, y: event.transform.original.top }

  if (target) {
    const containedTile = canvas.getObjects().find((obj) => tileIsContained(target, obj))

    if (containedTile !== undefined) {
      swapTiles(target, containedTile, initialPos)
      containedTile.set({ opacity: 1 })
    } else {
      target.setPositionByOrigin(initialPos, 'center', 'center')
    }

    target.set({ scaleX: 1, scaleY: 1, opacity: 1 })
    target.setCoords()
    canvas.renderAll()
    canvas.discardActiveObject()
  }
}

export const mouseDownListener = (event) => {
  const { target } = event
  if (target) {
    target.set({ scaleX: 0.7, scaleY: 0.7 })
    target.setCoords()
  }
}

export const objectMovingListener = (event) => {
  const { target } = event
  const { canvas } = target

  canvas.forEachObject((obj) => {
    if (tileIsContained(target, obj)) {
      obj.set({ opacity: 0.5 })
    } else {
      obj.set({ opacity: 1 })
    }
  })
}
