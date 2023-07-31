export const shuffleTiles = (tiles) => {
  const newTiles = [...tiles]
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    if (!newTiles[i].locked && !newTiles[j].locked) {
      [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]]
    }
  }

  const areEqual = newTiles.every((_, index) => newTiles[index].id === tiles[index].id)
  return areEqual ? shuffleTiles(newTiles) : newTiles
}

const shouldLockTile = (row, column, tileCount) => {
  const isTopLeft = row === 0 && column === 0
  const isTopRight = row === 0 && column === tileCount - 1
  const isBottomLeft = row === tileCount - 1 && column === 0
  const isBottomRight = row === tileCount - 1 && column === tileCount - 1
  const randomTile = row === Math.floor(Math.random() * (0 - tileCount - 1) + tileCount - 1)
    && column === Math.floor(Math.random() * (0 - tileCount - 1) + tileCount - 1)

  switch (tileCount) {
    case 3:
      return isTopLeft
    case 4:
      return isTopLeft || isBottomRight
    case 6:
      return isTopLeft || isBottomLeft || isTopRight
    case 8:
      return isTopLeft || isTopRight || isBottomLeft || isBottomRight
    case 10:
      return isTopLeft || isTopRight || isBottomLeft || isBottomRight || randomTile

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
