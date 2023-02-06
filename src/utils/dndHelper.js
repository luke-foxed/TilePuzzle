export const shuffleTiles = (tiles) => {
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]]
  }
  return tiles
}

export const generateTiles = async (img, tileCount) => {
  const image = img
  const tH = image.height / tileCount
  const imagePieces = []
  const tW = image.width / tileCount
  let index = 0
  for (let row = 0; row < tileCount; row++) {
    for (let column = 0; column < tileCount; column++) {
      const mockCanvas = document.createElement('canvas')
      const mockCanvasCtx = mockCanvas.getContext('2d')

      index += 1

      mockCanvas.width = tW
      mockCanvas.height = tH
      mockCanvasCtx.drawImage(image, column * tW, row * tH, tW, tH, 0, 0, tW, tH)

      imagePieces.push({ id: index, image: mockCanvas.toDataURL() })
    }
  }
  return imagePieces
}
