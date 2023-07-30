export const shuffleTiles = (tiles) => {
  const newTiles = tiles
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    if (!newTiles[i].locked && !newTiles[j].locked) {
      [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]]
    }
  }
  return newTiles
}

const shouldLockTile = (row, column, tileCount) => {
  const isTopLeft = row === 0 && column === 0
  const isTopRight = row === 0 && column === tileCount - 1
  const isBottomLeft = row === tileCount - 1 && column === 0
  const isBottomRight = row === tileCount - 1 && column === tileCount - 1

  switch (tileCount) {
    case 2:
      return isTopLeft
    case 4:
      return isTopLeft
    case 6:
      return isTopLeft || isBottomLeft || isTopRight
    case 8:
      return isTopLeft || isTopRight || isBottomLeft || isBottomRight
    case 10:
      return isTopLeft || isTopRight || isBottomLeft || isBottomRight

    default:
      return false
  }
}

export const generateTiles = async (img, tileCount) => {
  const image = img
  const tH = Math.floor(image.height / tileCount)
  const tW = Math.floor(image.width / tileCount)
  const imagePieces = []
  let id = 1
  for (let row = 0; row < tileCount; row++) {
    for (let column = 0; column < tileCount; column++) {
      const mockCanvas = document.createElement('canvas')
      const mockCanvasCtx = mockCanvas.getContext('2d')
      const locked = shouldLockTile(row, column, tileCount)
      mockCanvas.width = tW
      mockCanvas.height = tH
      mockCanvasCtx.drawImage(image, column * tW, row * tH, tW, tH, 0, 0, tW, tH)

      imagePieces.push({ id, image: mockCanvas.toDataURL(), locked, width: tW, height: tH })

      id += 1
    }
  }
  return imagePieces
}
