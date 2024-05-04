/**/
import { useEffect, useMemo } from 'react'
import levers from "../assets/jsons/levers.json"
import { DndContext, closestCenter } from '@dnd-kit/core'
import { Grid } from "../models/Grid"
import DrawnGats from "../components/DrawnGats"
import DrawnTiles from "../components/DrawnTiles"
import DrawnBoard from "../components/DrawnBoard"
import { useSubscribeState } from "../subscribe_state/index"
import { insertGatsTilesPositionsInGridHelper } from "../helpers/gridFunctionHelper"
import { handleDragStart, handleDragMove, handleDragOver, handleDragEnd, } from "../helpers/playFunctionHelper"
import "../styles/screens/play.css"

export default function Play() {
    const [{ lever }, dispatch] = useSubscribeState(["lever"])
    const movements = levers[lever].movements;

    useEffect(() => {
        const grid: (Grid & null)[] = insertGatsTilesPositionsInGridHelper(lever);
        dispatch({ type: "InitializeGrid", grid })
    }, [lever])

    const playMain = useMemo(() =>
        <>
            <DndContext
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <DrawnBoard tile_size={1} >
                    {/*
                         <Tiles />
                */}
                    <DrawnGats lever={lever} />
                </DrawnBoard>
            </DndContext>
        </>, [lever]
    )

    return (
        <div className="play">
            <div className="play-header">
                <button tabindex={0} className="btn" onClick={() => dispatch({ type: "ChangeStateViewPlay", isShow: false })} ><img src="images/back.png" atl="image of back arrow" /></button>
                <div>
                    <div>
                        <label>Lever</label>
                        <label>{lever + 1}</label>
                    </div>
                    <div>
                        <label>Gats in box</label>
                        <label>0</label>
                    </div>
                    <div>
                        <label>Movements</label>
                        <label>0 <sup>{movements}</sup></label>
                    </div>
                </div>
            </div>
            <div className="play-main">
                {playMain}
            </div>
        </div>
    )
}