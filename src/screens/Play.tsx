/**/
import { useMemo } from 'react'
import levels from "../assets/jsons/levels.json"
import { DndContext, closestCenter } from '@dnd-kit/core'
import { Grid } from "../models/Grid"
import { Tile } from "../models/Tile"
import NextMenu from "../components/NextMenu"
import GameMenu from "../components/GameMenu"
import DrawnCats from "../components/DrawnCats"
import DrawnTiles from "../components/DrawnTiles"
import DrawnBoard from "../components/DrawnBoard"
import WindowSound from "../components/WindowSound"
import { useSubscribeState } from "../subscribe_state/index"
import { handleDragStart, handleDragMove, handleDragOver, handleDragEnd, } from "../helpers/playFunctionHelper"
import "../styles/screens/play.css"

export default function Play() {
    const [{ level, catsInBoxes, movements, menuGame, confetti }, dispatch] = useSubscribeState(['level', 'catsInBoxes', 'movements', 'menuGame', 'confetti'])

    const topMovements = levels[level].movements;

    const playMain = useMemo(() =>
        <WindowSound src={"../assets/sound/next_lever.wav"}>
            <DndContext
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <DrawnBoard tile_size={1} >
                    <DrawnTiles />
                    <DrawnCats level={level} />
                </DrawnBoard>
            </DndContext>
        </WindowSound>, [level]
    )

    return (
        <div className="play">
            <div className="play-header">
                <button tabindex={0} className="btn" onClick={() => dispatch({ type: "ShowMenuOfGame", isShow: true })} >
                    <img src="images/menu.png" atl="image of menu arrow" />
                </button>
                <div>
                    <div>
                        <label>Level</label>
                        <label>{level}</label>
                    </div>
                    <div>
                        <label>Gats in boxes</label>
                        <label>{catsInBoxes.length}</label>
                    </div>
                    <div>
                        <label>Movements</label>
                        <label style={{ color: movements > topMovements ? "red" : "black" }} >{movements} <sup>{topMovements}</sup></label>
                    </div>
                </div>
            </div>
            <div className="play-main">
                {confetti && <NextMenu level={level + 1} />
                }
                {menuGame && <GameMenu />}
                {playMain}
            </div>
        </div>
    )
}