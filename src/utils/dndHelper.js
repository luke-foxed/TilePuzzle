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

  const isCenterRow = row === Math.floor(tileCount / 2)
  || row === Math.floor(tileCount / 2) - 1
  const isCenterColumn = column === Math.floor(tileCount / 2)
  || column === Math.floor(tileCount / 2) - 1

  const isCenter = isCenterColumn && isCenterRow

  switch (tileCount) {
    case 3:
      return isTopLeft || isBottomRight
    case 4:
      return isTopLeft || isBottomRight
    case 6:
      return isTopLeft || isBottomLeft || isTopRight
    case 8:
      return isTopLeft || isTopRight || isBottomLeft || isBottomRight
    case 10:
      return isTopLeft || isTopRight || isBottomLeft || isBottomRight || isCenter
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

const parseRgbString = (rgbString) => {
  const match = rgbString.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/)
  // Extract the values from the regex match
  const r = parseInt(match[1], 10)
  const g = parseInt(match[2], 10)
  const b = parseInt(match[3], 10)

  // Create and return the object
  return { r, g, b }
}

export const generateTileShadesV2 = async (width, height, colors, tileCount) => {
  const tileHeight = Math.floor(height / tileCount)
  const tileWidth = Math.floor(width / tileCount)
  const tiles = []

  const canvas = document.createElement('canvas')
  const canvasCtx = canvas.getContext('2d')

  canvas.width = tileWidth
  canvas.height = tileHeight

  let id = 1

  for (let row = 0; row < tileCount; row++) {
    for (let column = 0; column < tileCount; column++) {
      const locked = shouldLockTile(row, column, tileCount)

      // Calculate interpolation factors for both rows and columns
      const tX = column / (tileCount - 1)
      const tY = row / (tileCount - 1)

      // If four colors, blend them together
      const color1 = parseRgbString(colors[0])
      const color2 = parseRgbString(colors[1])
      const color3 = parseRgbString(colors[2])
      const color4 = parseRgbString(colors[3])

      const r = Math.round(
        (1 - tY) * (1 - tX) * color1.r
            + tY * (1 - tX) * color4.r
            + (1 - tY) * tX * color2.r
            + tY * tX * color3.r,
      )

      const g = Math.round(
        (1 - tY) * (1 - tX) * color1.g
            + tY * (1 - tX) * color4.g
            + (1 - tY) * tX * color2.g
            + tY * tX * color3.g,
      )

      const b = Math.round(
        (1 - tY) * (1 - tX) * color1.b
            + tY * (1 - tX) * color4.b
            + (1 - tY) * tX * color2.b
            + tY * tX * color3.b,
      )

      const tileColor = `rgb(${r}, ${g}, ${b})`

      canvasCtx.fillStyle = tileColor
      canvasCtx.fillRect(0, 0, tileWidth, tileHeight)
      tiles.push({
        id,
        image: canvas.toDataURL(),
        locked,
        width: tileWidth,
        height: tileHeight,
        color: tileColor,
      })

      id += 1
    }
  }
  return tiles
}

export const generateThumbnail = async (colors) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  // Set square size and padding
  const squareSize = 96
  const padding = 4

  // Set canvas size based on squares and padding
  canvas.width = squareSize * 2 + padding * 3
  canvas.height = squareSize * 2 + padding * 3

  // Iterate over colors and draw squares
  colors.forEach((color, index) => {
    const row = Math.floor(index / 2)
    const col = index % 2

    const x = col * (squareSize + padding)
    const y = row * (squareSize + padding)

    ctx.fillStyle = color
    ctx.fillRect(x, y, squareSize, squareSize)
  })

  // Convert the canvas to a base64 image
  const base64Image = canvas.toDataURL()

  return base64Image
}
