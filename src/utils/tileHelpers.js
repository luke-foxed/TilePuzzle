export const generateTiles = (padding, rows, columns, canvas) => {
  const tileWidth = canvas.getWidth() / rows
  const tileHeight = canvas.getHeight() / columns
  let index = 0
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      const imageTileData = ctx.getImageData(column * tileWidth, row * tileHeight, tileWidth, tileHeight)
      const mockCanvas = document.createElement('canvas')
      const mockCanvasCtx = mockCanvas.getContext('2d')

      mockCanvas.width = tileWidth
      mockCanvas.height = tileHeight
      mockCanvasCtx.putImageData(imageTileData, 0, 0)

      fabric.Image.fromURL(mockCanvas.toDataURL('image/png'), (img) => {
        img.set({
          left: column * tileWidth + padding * column + tileWidth / 2,
          top: row * tileHeight + padding * row + tileHeight / 2,
          originX: 'center',
          originY: 'center',
          hasControls: false,
          padding,
          index,
        })

        console.log('GENERATING TILE', img.index)

        canvas.add(img)
        index++
      })
    }
  }
}

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

export const swapTiles = (tile1, tile2, tile1OldPosition) => {
  const tile1Index = tile1.index
  const tile2Index = tile2.index

  const tile1Position = tile1OldPosition || { x: tile1.left, y: tile1.top }

  tile1.setPositionByOrigin({ x: tile2.left, y: tile2.top }, 'center', 'center')
  tile2.setPositionByOrigin(tile1Position, 'center', 'center')
  tile1.set({ index: tile2Index })
  tile2.set({ index: tile1Index })

  tile1.setCoords()
  tile2.setCoords()
}
