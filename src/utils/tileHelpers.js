// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array/6274381#6274381
const shuffleArray = (a) => {
  const arr = a
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return a
}

export const tileIsContained = (innerTile, outerTile) => {
  let isContained = false

  innerTile.setCoords()

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
      targetTop > neighbourTop
      && targetBottom < neighbourBottom
      && targetLeft > neighbourLeft
      && targetRight < neighbourRight
    ) {
      isContained = true
    } else {
      isContained = false
    }
  } else {
    isContained = false
  }
  return isContained
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

const shuffleTiles = (correctOrder, canvas) => {
  const jumbledOrder = shuffleArray(correctOrder)

  canvas.forEachObject((obj, index) => {
    const randomIndex = jumbledOrder[index]
    const randomTile = canvas.getObjects().find((tile) => tile.index === randomIndex)

    swapTiles(randomTile, obj)
  })

  canvas.renderAll()
}

export const generateTiles = (padding, tileCount, canvas) => {
  const tileWidth = canvas.getWidth() / tileCount
  const tileHeight = canvas.getHeight() / tileCount
  let index = 0
  for (let row = 0; row < tileCount; row++) {
    for (let column = 0; column < tileCount; column++) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      const imageTileData = ctx.getImageData(
        column * tileWidth,
        row * tileHeight,
        tileWidth,
        tileHeight,
      )
      const mockCanvas = document.createElement('canvas')
      const mockCanvasCtx = mockCanvas.getContext('2d')

      mockCanvas.width = tileWidth
      mockCanvas.height = tileHeight
      mockCanvasCtx.putImageData(imageTileData, 0, 0)

      // eslint-disable-next-line no-undef, no-loop-func
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

        canvas.add(img)
        index += 1
      })
    }
  }

  // adding small delay so tiles are on canvas before attempting shuffle
  setTimeout(() => {
    shuffleTiles([...Array(tileCount * tileCount).keys()], canvas)
  }, 100)
}
