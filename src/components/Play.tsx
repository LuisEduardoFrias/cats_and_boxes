//
import { DndContext, closestCenter } from '@dnd-kit/core';
import Gats from "./gats"
import Tiles from "./tiles"
import Board from "./board"
import { useSubscribeState } from "../subscribe_state/index"
import { handleDragStart, handleDragMove, handleDragOver, handleDragEnd, } from "../helpers/helper_game"
import "../styles/play.css"

export default function Play() {
    const [{ lever, grid }, dispatch] = useSubscribeState(["lever", "grid"])

    return (
        <div className="play">
            <div className="play-header">
                <button tabindex={0} className="btn" onClick={() => dispatch({ type: "ChangeStateViewPlay", isShow: false })} ><img src="images/back.png" atl="image of back arrow" /></button>
                <div>
                    <label>Lever: {lever}</label>
                    <label>Gats in box: 4</label>
                </div>
            </div>
            <div className="play-main">
                <DndContext
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <Board tile_size={1} >
                        <Tiles />
                        <Gats />
                    </Board>
                </DndContext>
            </div>
        </div>
    )
}