/***/
import { useMemo } from 'react'
import levels from "../assets/jsons/levels.json"
import game_decription from "../assets/jsons/game_description.json"
import { DndContext, closestCenter } from '@dnd-kit/core'
import { Grid } from "../models/Grid"
import { Tile } from "../models/Tile"
import { selectAll } from "../models/SelectAll"
import { Toolt, arrow } from "../models/Tooltip";
import NextMenu from "../components/NextMenu"
import GameMenu from "../components/GameMenu"
import DrawnGats from "../components/DrawnGats"
import Tooltip from "../components/Tooltip"
import DrawnTiles from "../components/DrawnTiles"
import DrawnBoard from "../components/DrawnBoard"
import Sound from "../components/Sound"
import WindowSound from "../components/WindowSound"
import { useSubscribeState } from "../subscribe_state/index"
import { handleDragStart, handleDragMove, handleDragOver, handleDragEnd, } from "../helpers/playFunctionHelper"
import "../styles/screens/play.css"
import "../styles/screens/tutorial.css"

export default function Tutorial() {
    const [{ level, gatsInBixes, movements, menuGame, confetti }, dispatch] = useSubscribeState(['level', 'gatsInBixes', 'movements', 'menuGame', 'confetti'])

    const topMovements = levels[level].movements;

    const tooltips: Toolt[] = [
        {
            message: "Menu button",
            point: { x: 20, y: 50 },
            arrow: arrow.top_left,
            fn: () => {
                dispatch({ type: "GameReset", level: 4 })
            }
        },
        {
            message: "Levels: identify the level you are on.",
            point: { x: 70, y: 50 },
            arrow: arrow.top_left,
            fn: null
        },
        {
            message: "Cats in boxes: indicates how many cats are inside boxes.",
            point: { x: 160, y: 50 },
            arrow: arrow.top_left,
            fn: null
        },
        {
            message: "Moves: indicates the piece movements you have made, the potential indicates the minimum movements to solve the puzzle.",
            point: { x: 210, y: 50 },
            arrow: arrow.top_right,
            fn: null
        },
        {
            message: "Pieces: pieces to play with.",
            point: { x: 130, y: 180 },
            arrow: arrow.none,
            fn: () => {
                dispatch({ type: "SelectAll", SelectAll: selectAll.pieces })
            }
        },
        {
            message: "Boxes: the box that should be placed on top of the cats.",
            point: { x: 130, y: 120 },
            arrow: arrow.bottom_left,
            fn: () => {
                dispatch({ type: "SelectAll", SelectAll: selectAll.boxes })
            }
        },
        {
            message: "Cats: there are five cats that you must place in boxes.",
            point: { x: 170, y: 115 },
            arrow: arrow.bottom_left,
            fn: () => {
                dispatch({ type: "SelectAll", SelectAll: selectAll.cats })
            }
        },
        {
            message: "Play\n\n" + game_decription.description,
            point: { x: 170, y: 115 },
            arrow: arrow.bottom_left,
            fn: () => {
                dispatch({ type: "SelectAll", SelectAll: selectAll.none })
            }
        },
        {
            message: "Select a tile by clicking on it",
            point: { x: 170, y: 50 },
            arrow: arrow.bottom_left,
            fn: () => {
                dispatch({ type: "SelectTile", tile: { name: "z", rotation: 270, point: { x: 2, y: 2 } } })
            }
        },
        {
            message: "The tile will be focused and you will have a control panel with 2 buttons",
            point: { x: 150, y: 60 },
            arrow: arrow.top_left,
            fn: null
        },
        {
            message: "The first button is to rotate the tile.",
            point: { x: 170, y: 60 },
            arrow: arrow.top_left,
            fn: null
        },
        {
            message: "The second button is to release the tile.",
            point: { x: 120, y: 60 },
            arrow: arrow.top_right,
            fn: null
        },
        {
            message: "When you press the rotate button, the tile rotates 90 degrees to the right.",
            point: { x: 30, y: 120 },
            arrow: arrow.none,
            fn: () => {
                dispatch({ type: "ChangeRotation", rotation: 0, tile_name: "z" })
            }
        },
        {
            message: "Notice that the release button has changed color, indicating that you cannot release the tile in this position.",
            point: { x: 130, y: 60 },
            arrow: arrow.top_right,
            fn: null
        },
        {
            message: "This can happen in 2 scenarios: 1. if the tile is on top of another tile; 2. if a part of the tile that is not the box is on top of a cat.",
            point: { x: 90, y: 130 },
            arrow: arrow.top_right,
            fn: null
        },
        {
            message: "The tile has rotated 180 degrees to the right.",
            point: { x: 30, y: 120 },
            arrow: arrow.none,
            fn: () => {
                dispatch({ type: "ChangeRotation", rotation: 90, tile_name: "z" })
            }
        },
        {
            message: "This time, when rotating the tile, one of the boxes of this tile has fallen directly on top of a cat, and the cat has hidden in the box.",
            point: { x: 90, y: 260 },
            arrow: arrow.top_right,
            fn: null
        },
        {
            message: "You may also notice that it now allows you to release the tile.",
            point: { x: 120, y: 60 },
            arrow: arrow.top_right,
            fn: null
        },
        {
            message: "The number of cats will be counted or subtracted when they hide in the boxes or come out of the box.",
            point: { x: 80, y: 50 },
            arrow: arrow.top_right,
            fn: () => {
                dispatch({ type: "DeselectTile" })
            }
        },
        {
            message: "Also, when releasing the tile, the movements will be counted if you have moved or rotated the tile from its previous position.",
            point: { x: 190, y: 50 },
            arrow: arrow.top_right,
            fn: null
        },
        {
            message: "Let's start playing.",
            point: { x: 130, y: 150 },
            arrow: arrow.none,
            fn: null
        },
        {
            message: "Click on the menu",
            point: { x: 20, y: 40 },
            arrow: arrow.top_left,
            fn: () => {
                dispatch({ type: "ShowGameMenu", isShow: true })
            }
        },
        {
            message: "Click to reset the game.",
            point: { x: 120, y: 70 },
            arrow: arrow.bottom_right,
            fn: null
        },
        //t
        {
            message: "Select a tile.",
            point: { x: 120, y: 180 },
            arrow: arrow.bottom_right,
            fn: () => {
                dispatch({ type: "GameReset" })
                dispatch({ type: "SelectTile", tile: { name: "t", rotation: 0, point: { x: 2, y: 0 } } })
            }
        },
        {
            message: "Rotate the tile.",
            point: { x: 70, y: 60 },
            arrow: arrow.bottom_right,
            fn: () => {
                dispatch({ type: "ChangeRotation", rotation: 90, tile_name: "t" })
            }
        },
        {
            message: "Move the tile on top of a cat.",
            point: { x: 200, y: 110 },
            arrow: arrow.bottom_right,
            fn: () => {
                dispatch({ type: "Move", position: { x: 3, y: 0 }, tile: "t" })
            }
        },
        {
            message: "Release the tile.",
            point: { x: 200, y: 110 },
            arrow: arrow.bottom_right,
            fn: () => {
                dispatch({ type: "DeselectTile" })
            }
        },
        //j
        {
            message: "Select a tile.",
            point: { x: 20, y: 50 },
            arrow: arrow.bottom_right,
            fn: () => {
                dispatch({ type: "SelectTile", tile: { name: "j", rotation: 0, point: { x: 0, y: 1 } } })
            }
        },
        {
            message: "Rotate the tile until it reaches the ideal position.",
            point: { x: 30, y: 60 },
            arrow: arrow.bottom_left,
            fn: () => {
                dispatch({ type: "ChangeRotation", rotation: 270, tile_name: "j" })
            }
        },
        {
            message: "Move the tile on top of a cat.",
            point: { x: 40, y: 180 },
            arrow: arrow.bottom_left,
            fn: () => {
                dispatch({ type: "Move", position: { x: 0, y: 0 }, tile: "j" })
            }
        },
        {
            message: "Release the tile.",
            point: { x: 30, y: 180 },
            arrow: arrow.bottom_left,
            fn: () => {
                dispatch({ type: "DeselectTile" })
            }
        },
        //z
        {
            message: "Select a tile.",
            point: { x: 120, y: 50 },
            arrow: arrow.bottom_right,
            fn: () => {
                dispatch({ type: "SelectTile", tile: { name: "z", rotation: 270, point: { x: 2, y: 2 } } })
            }
        },
        {
            message: "Rotate the tile.",
            point: { x: 70, y: 50 },
            arrow: arrow.bottom_right,
            fn: () => {
                dispatch({ type: "ChangeRotation", rotation: 180, tile_name: "z" })
            }
        },
        {
            message: "Move the tile on top of a cat.",
            point: { x: 30, y: 50 },
            arrow: arrow.bottom_right,
            fn: () => {
                dispatch({ type: "Move", position: { x: 0, y: 1 }, tile: "z" })
            }
        },
        {
            message: "Release the tile.",
            point: { x: 30, y: 50 },
            arrow: arrow.bottom_right,
            fn: () => {
                dispatch({ type: "DeselectTile" })
            }
        },
        //l
        {
            message: "Select a tile.",
            point: { x: 120, y: 130 },
            arrow: arrow.top_left,
            fn: () => {
                dispatch({ type: "SelectTile", tile: { name: "l", rotation: 270, point: { x: 0, y: 3 } } })
            }
        },
        {
            message: "Rotate the tile.",
            point: { x: 100, y: 50 },
            arrow: arrow.bottom_left,
            fn: () => {
                dispatch({ type: "ChangeRotation", rotation: 0, tile_name: "l" })
            }
        },
        {
            message: "Move the tile on top of a cat.",
            point: { x: 220, y: 110 },
            arrow: arrow.bottom_left,
            fn: () => {
                dispatch({ type: "Move", position: { x: 2, y: 2 }, tile: "l" })
            }
        },
        {
            message: "Release the tile and you have completed this level.",
            point: { x: 130, y: 60 },
            arrow: arrow.none,
            fn: () => {
                dispatch({ type: "DeselectTile" })
            }
        },
        //
        {
            message: "Restart tutorial?",
            point: { x: 130, y: 60 },
            arrow: arrow.none,
            exit: true,
            fn: () => {
                dispatch({ type: "GoToTutorialView", isShow: false })
            }
        },
        //
    ];

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
                    <DrawnGats level={level} />
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
                        <label>{gatsInBixes.length}</label>
                    </div>
                    <div>
                        <label>Movements</label>
                        <label style={{ color: movements > topMovements ? "red" : "black" }} >{movements} <sup>{topMovements}</sup></label>
                    </div>
                </div>
            </div>
            <div className="play-main">
                {confetti && <NextMenu level={level + 1} />}
                {menuGame && <GameMenu />}
                {playMain}
            </div>
            <div className="screen"></div>
            <Tooltip tooltips={tooltips} />
        </div>
    )
}