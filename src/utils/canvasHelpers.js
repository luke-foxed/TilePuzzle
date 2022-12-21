import { swapTiles, tileIsContained } from './tileHelpers'

export const mouseUpListener = (event, canvas, correctOrder) => {
  const target = event.target
  const initialPos = { x: event.transform.original.left, y: event.transform.original.top }

  if (target) {
    const containedTile = canvas.getObjects().filter((obj) => tileIsContained(target, obj))

    if (containedTile.length !== 0) {
      swapTiles(target, initialPos, containedTile[0], correctOrder)
    } else {
      target.setPositionByOrigin(initialPos, 'center', 'center')
    }

    target.set({ scaleX: 1, scaleY: 1 })
    canvas.discardActiveObject()
  }
}

export const mouseDownListener = (event) => {
    console.log('running')
  const target = event.target
  if (target) {
    target.set({ scaleX: 0.7, scaleY: 0.7 })
  }
}

export const objectMovingListener = (event, canvas) => {
  const target = event.target

  canvas.forEachObject((obj) => {
    if (tileIsContained(target, obj)) {
      obj.set({ opacity: 0.5 })
    } else {
      obj.set({ opacity: 1 })
    }
  })
}
