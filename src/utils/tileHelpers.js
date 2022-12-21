export const tileIsContained = (innerTile, outerTile) => {
  let tileIsContained = false

  innerTile.setCoords()

  if (outerTile === innerTile) return
  if (innerTile.intersectsWithObject(outerTile)) {
    const neighbourTop = outerTile.top * 2 - outerTile.height
    const neighbourBottom = outerTile.top * 2
    const neighbourLeft = outerTile.left * 2 - outerTile.width
    const neighbourRight = outerTile.left * 2

    const targetTop = innerTile.top * 2 - innerTile.height * 0.7
    const targetBottom = innerTile.top * 2 * 0.7
    const targetLeft = innerTile.left * 2 - innerTile.width * 0.7
    const targetRight = innerTile.left * 2 * 0.7

    if (
      targetTop > neighbourTop &&
      targetBottom < neighbourBottom &&
      targetLeft > neighbourLeft &&
      targetRight < neighbourRight
    ) {
      tileIsContained = true
    } else {
      tileIsContained = false
    }
  } else {
    tileIsContained = false
  }
  return tileIsContained
}

export const swapTiles = (tile1, tile1OldPosition, tile2, order) => {
    let newOrder = order
    tile1.setPositionByOrigin({ x: tile2.left, y: tile2.top }, 'center', 'center')
    tile2.setPositionByOrigin(tile1OldPosition, 'center', 'center')
    tile1.set({ index: tile2.index })
    tile2.set({ index: tile1.index })
    tile1.setCoords()
    tile2.setCoords()


    order[tile1.index] = tile2.index
    order[tile2.index] = tile1.index

    tile1.set({ index: tile2.index })
    tile2.set({ index: tile1.index })


    return tile2

}
