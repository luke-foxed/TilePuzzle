export const tileIsContained = (innerTile, outerTile) => {
  let tileIsContained = false

  innerTile.setCoords()

  if (outerTile === innerTile) return
  if (innerTile.intersectsWithObject(outerTile)) {

    // easier to calculate when using top-left as origin
    const outerTileTop = outerTile.getPointByOrigin('left', 'top').y
    const outerTileLeft = outerTile.getPointByOrigin('left', 'top').x
    const innerTileTop = innerTile.getPointByOrigin('left', 'top').y
    const innerTileLeft = innerTile.getPointByOrigin('left', 'top').x

    const neighbourTop = outerTileTop
    const neighbourBottom = outerTileTop + outerTile.height
    const neighbourLeft = outerTileLeft
    const neighbourRight = outerTileLeft + outerTile.width

    const targetTop = innerTileTop
    const targetBottom = innerTileTop + innerTile.height * 0.7
    const targetLeft = innerTileLeft
    const targetRight = innerTileLeft + innerTile.width * 0.7

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

}
