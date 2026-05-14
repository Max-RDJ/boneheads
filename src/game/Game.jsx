import { useEffect } from 'react'
import { Arena } from './combat'
import './Game.css'

function Game() {
    useEffect(() => {
    }, [])

    return (
        <div id="game-container">
            <Arena />
        </div>
    )
}

export default Game