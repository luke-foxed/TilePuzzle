/* eslint-disable no-console */
const { hexToRgb, hslToRgb } = require('@mui/material')
const { initializeApp } = require('firebase/app')
const { getFirestore, setDoc, doc } = require('firebase/firestore')
const { v4: uuid } = require('uuid')
require('dotenv').config({ path: '.env.local' })

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// taken and modified from https://stackoverflow.com/questions/17433015/change-the-hue-of-a-rgb-color-in-javascript
const hexToHSL = (hex) => {
  // strip the leading # if it's there
  let convertedHex = hex.replace(/^\s*#|\s*$/g, '')

  // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
  if (hex.length === 3) {
    convertedHex = hex.replace(/(.)/g, '$1$1')
  }

  const r = parseInt(convertedHex.substr(0, 2), 16) / 255
  const g = parseInt(convertedHex.substr(2, 2), 16) / 255
  const b = parseInt(convertedHex.substr(4, 2), 16) / 255
  const cMax = Math.max(r, g, b)
  const cMin = Math.min(r, g, b)
  const delta = cMax - cMin
  const l = (cMax + cMin) / 2
  let h = 0
  let s = 0

  if (delta === 0) {
    h = 0
  } else if (cMax === r) {
    h = 60 * (((g - b) / delta) % 6)
  } else if (cMax === g) {
    h = 60 * ((b - r) / delta + 2)
  } else {
    h = 60 * ((r - g) / delta + 4)
  }

  if (delta === 0) {
    s = 0
  } else {
    s = delta / (1 - Math.abs(2 * l - 1))
  }

  return { h, s, l }
}

const rgbNormalizeValue = (color, m) => {
  let convertedColor = Math.floor((color + m) * 255)
  if (color < 0) {
    convertedColor = 0
  }
  return convertedColor
}

// eslint-disable-next-line no-bitwise
const rgbToHex = (r, g, b) => `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`

// expects an object and returns a string
const hslToHex = (hsl) => {
  const { h, s, l } = hsl
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r
  let g
  let b

  if (h < 60) {
    r = c
    g = x
    b = 0
  } else if (h < 120) {
    r = x
    g = c
    b = 0
  } else if (h < 180) {
    r = 0
    g = c
    b = x
  } else if (h < 240) {
    r = 0
    g = x
    b = c
  } else if (h < 300) {
    r = x
    g = 0
    b = c
  } else {
    r = c
    g = 0
    b = x
  }

  r = rgbNormalizeValue(r, m)
  g = rgbNormalizeValue(g, m)
  b = rgbNormalizeValue(b, m)

  return rgbToHex(r, g, b)
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

const changeHue = (rgbArray, degree) => {
  const [r, g, b] = rgbArray
  const hex = rgbToHex(r, g, b)
  const hsl = hexToHSL(hex)
  hsl.h += degree
  if (hsl.h > 360) {
    hsl.h -= 360
  } else if (hsl.h < 0) {
    hsl.h += 360
  }

  const convertedHex = hslToHex(hsl)
  const convertedRgb = hexToRgb(convertedHex)
  const { r: changedR, g: changedG, b: changedB } = parseRgbString(convertedRgb)
  return [changedR, changedG, changedB]
}

const getHueDifference = (difficulty) => {
  switch (difficulty) {
    case 1:
      return 30
    case 2:
      return 40
    case 3:
      return 50
    case 4:
      return 60
    case 5:
      return 70
    default:
      return 30
  }
}

// generate a color that has a luminance of at least 50%
const getRandomColor = () => {
  const hslColor = `hsl(${Math.random() * 360}, 100%, 50%)`
  const { r, g, b } = parseRgbString(hslToRgb(hslColor))
  return [r, g, b]
}

const generateTileColors = (difficulty) => {
  const hueDifference = getHueDifference(difficulty)

  // Lighten color1 by 25%
  const color1 = getRandomColor()
  const color2 = changeHue(color1, hueDifference)
  const color3 = changeHue(color2, hueDifference)
  const color4 = changeHue(color3, hueDifference)

  return [color1, color2, color3, color4].map(
    (color) => `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
  )
}

// Function to add a level to Firestore
const addLevel = async (levelData) => {
  try {
    await setDoc(doc(db, 'gradients', uuid()), levelData)
    console.log('Level created')
  } catch (error) {
    console.error('Error adding level:', error)
  }
}

// Main script to add 20 levels
const addLevels = async () => {
  for (let difficulty = 1; difficulty <= 5; difficulty++) {
    for (let i = 0; i < 4; i++) {
      const colors = generateTileColors(difficulty)
      const levelData = {
        colors,
        difficulty,
        scores: [],
        level: i + (difficulty - 1) * 4 + 1, // Ensuring unique levels for each difficulty
      }
      // eslint-disable-next-line no-await-in-loop
      await addLevel(levelData)
    }
  }
}

// Run the script
addLevels()
