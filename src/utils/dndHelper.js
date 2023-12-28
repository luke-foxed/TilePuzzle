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

export const generateTiles = async (img, tileCount, pattern) => {
  const image = img
  const tH = Math.floor(image.height / tileCount)
  const tW = Math.floor(image.width / tileCount)
  const imagePieces = []
  let id = 1
  for (let row = 0; row < tileCount; row++) {
    for (let column = 0; column < tileCount; column++) {
      const mockCanvas = document.createElement('canvas')
      const mockCanvasCtx = mockCanvas.getContext('2d')
      const locked = pattern[row * tileCount + column] === 'x'

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

export const generateTileShadesV2 = async (width, height, colors, tileCount, pattern) => {
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
      const locked = pattern[row * tileCount + column] === 'x'

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

export const generateThumbnail = (colors) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const squareSize = 94
  const padding = 6

  canvas.width = Math.floor(squareSize * 2 + padding * 3)
  canvas.height = Math.floor(squareSize * 2 + padding * 3)

  // this is the order the colors are rendered during the game
  const orderedColors = [colors[0], colors[1], colors[3], colors[2]]

  // Iterate over colors and draw squares
  orderedColors.forEach((color, index) => {
    const row = Math.floor(index / 2)
    const col = index % 2

    const x = Math.floor(col * (squareSize + padding) + padding)
    const y = Math.floor(row * (squareSize + padding) + padding)

    ctx.fillStyle = color
    ctx.fillRect(x, y, squareSize, squareSize)
  })

  // Convert the canvas to a base64 image
  const base64Image = canvas.toDataURL()

  return base64Image
}
