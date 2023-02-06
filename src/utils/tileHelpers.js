import { fabric } from 'fabric-pure-browser';

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
  if (!tile1.locked || !tile2.locked) {
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
}

const shuffleTiles = (tiles) => {
  const jumbledTiles = tiles

  // https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array/6274381#6274381
  for (let i = jumbledTiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    if (!jumbledTiles[i].locked && !jumbledTiles[j].locked) {
      swapTiles(jumbledTiles[i], jumbledTiles[j])
    }
  }
  return jumbledTiles
}

const loadImage = (src) => new Promise((resolve, reject) => {
  const img = new Image()
  img.crossOrigin = 'Anonymous' // to avoid CORS if used with Canvas
  img.src = src
  img.onload = () => {
    resolve(img)
  }
  img.onerror = (e) => {
    reject(e)
  }
})

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

export const generateTilesV2 = async (img, tileCount) => {
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

export const generateTiles = async (padding, tileCount, canvas) => {
  const image = await loadImage(canvas.toDataURL('image/png'))
  const tiles = []
  const tW = canvas.getWidth() / tileCount // (tile width)
  const tH = canvas.getHeight() / tileCount // (tile height)
  const blankImage = new fabric.Image('') // clear the background image after we've stored it in a variable
  canvas.setBackgroundImage(blankImage, canvas.renderAll.bind(canvas))
  let index = 0
  for (let row = 0; row < tileCount; row++) {
    for (let column = 0; column < tileCount; column++) {
      const mockCanvas = document.createElement('canvas')
      const mockCanvasCtx = mockCanvas.getContext('2d')

      mockCanvas.width = tW
      mockCanvas.height = tH
      mockCanvasCtx.drawImage(image, column * tW, row * tH, tW, tH, 0, 0, tW, tH)

      // eslint-disable-next-line no-undef, no-loop-func
      const tilePromise = new Promise((resolve) => {
        fabric.Image.fromURL(mockCanvas.toDataURL('image/png'), (img) => {
          const params = {
            left: column * tW + padding * column + tW / 2,
            top: row * tH + padding * row + tH / 2,
            originX: 'center',
            originY: 'center',
            hasControls: false,
            padding,
            index,
          }

          const shouldLock = shouldLockTile(row, column, tileCount)

          if (shouldLock) {
            index += 1
            const text = new fabric.Text('●', {
              left: tW / 2,
              top: tH / 2,
              fontSize: 30,
              originX: 'center',
              originY: 'center',
              fill: 'black',
            })

            const group = new fabric.Group([img, text])
            group.cloneAsImage((clone) => {
              clone.set({ ...params, locked: true, lockMovementX: true, lockMovementY: true })
              resolve(clone)
            })
          } else {
            index += 1
            img.set(params)
            resolve(img)
          }
        })
      })
      tiles.push(tilePromise)
    }
  }

  const shuffledTiles = shuffleTiles(await Promise.all(tiles))
  shuffledTiles.forEach((t) => canvas.add(t))
}
