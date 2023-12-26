/* eslint-disable no-console */
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

// Function to generate an analogous color palette
function generateAnalogousPalette() {
  const randomColorValue = () => Math.floor(Math.random() * 256);
  const baseHue = Math.floor(Math.random() * 360);

  // Generate a random base color
  const baseColor = [baseHue, randomColorValue(), randomColorValue()];

  // Generate three analogous colors with a minimum difference in hue
  const hueDifference = 30; // Adjust this value for a larger or smaller difference
  const analogous1 = [(baseColor[0] + hueDifference) % 360, randomColorValue(), randomColorValue()];
  const analogous2 = [
    (baseColor[0] + 2 * hueDifference) % 360,
    randomColorValue(),
    randomColorValue(),
  ]
  const analogous3 = [
    (baseColor[0] - hueDifference + 360) % 360,
    randomColorValue(),
    randomColorValue(),
  ]

  // Convert colors to "rgb(r, g, b)" format
  const formatColor = (color) => `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

  return [baseColor, analogous1, analogous2, analogous3].map(formatColor);
}

// Function to add a level to Firestore
async function addLevel(levelData) {
  try {
    await setDoc(doc(db, 'gradients', uuid()), levelData)
    console.log('Level created')
  } catch (error) {
    console.error('Error adding level:', error)
  }
}

// Main script to add 20 levels
async function addLevels() {
  for (let difficulty = 1; difficulty <= 5; difficulty++) {
    for (let i = 0; i < 4; i++) {
      const colors = generateAnalogousPalette()
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
