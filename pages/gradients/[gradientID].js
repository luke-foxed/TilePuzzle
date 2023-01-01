import { Grid } from '@mui/material'
import { useCallback, useContext, useState } from 'react'
import useSWR from 'swr'
import axios from 'axios'
import { isEqual } from 'lodash'
import Canvas from '../../src/components/canvas'
import { getGradients } from '../api/gradients'
import { getGradient } from '../api/gradients/[gradientID]'
import { AuthUserContext } from '../../src/context/userProvider'

const DEFAULT_GAME_STATE = { completed: false, moves: 0, time: 0 }

function Gradient({ gradientData }) {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameState, setGameState] = useState(DEFAULT_GAME_STATE)
  const { authUser } = useContext(AuthUserContext)
  const { completed, ...data } = gameState
  const postData = authUser ? { ...data, user: authUser.displayName } : data

  const fetcher = async (url) => axios.post(url, { data: postData })

  useSWR(completed && gradientData.id ? `http://localhost:3001/api/gradients/${gradientData.id}` : null, fetcher)

  const handleGameCompleted = useCallback((newState) => {
    if (!isEqual(gameState, newState)) {
      setGameState(newState)
    }
  }, [gameState])

  return (
    <div key={gradientData.id}>
      {gradientData.url && (
        <Grid direction="row" container justifyContent="center" alignItems="center">
          <Canvas
            imageInput={gradientData.url}
            gameStarted={gameStarted}
            onGameToggle={(toggle) => setGameStarted(toggle)}
            onGameCompleted={(newState) => handleGameCompleted(newState)}
          />
        </Grid>
      )}
    </div>
  )
}

export async function getStaticPaths() {
  let paths = []
  try {
    const gradients = await getGradients()

    paths = gradients.map((gradient) => ({
      params: { gradientID: gradient.id },
    }))

    return { paths, fallback: false }
  } catch (error) {
    return { paths, fallback: false }
  }
}

export async function getStaticProps({ params }) {
  const id = params.gradientID
  const gradientData = await getGradient(id)

  return {
    props: {
      gradientData,
    },
  }
}

export default Gradient
