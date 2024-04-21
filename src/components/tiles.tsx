import { useEffect } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { useSubscribeState, dispatch } from "../subscribe_state/index"
import Point from "../models/point"
import { Piece } from "../models/piece"
import "../styles/tiles.css"

export default function Tiles() {
    const [{ tiles_position, tile_seleted, pieces }, _] = useSubscribeState(["tiles_position", "tile_seleted", "pieces"])

    return (
        <>
            {pieces.map((piece: Piece, index: number) => <DrawTile
                index={index}
                piece={piece}
                isSelected={piece.name === tile_seleted}
                rotation={tiles_position[piece.name].rotation}
                position={tiles_position[piece.name].point}
            />)}
        </>
    )
}

interface IDrawTileProps {
    piece: Piece,
    index: number,
    rotation: 0 | 90 | 180 | 270,
    position: Point,
    isSelected: boolean
}

function DrawTile({ piece, index, rotation, position, isSelected }: IDrawTileProps) {

    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: piece.name, });

    piece.rotation = rotation;
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    const width = rotation === 0 || rotation === 180 ? piece.size.horizontal.width : piece.size.vertical.width;
    const height = rotation === 0 || rotation === 180 ? piece.size.horizontal.height : piece.size.vertical.height;
    const _left = (position?.x - 1) * 64;
    const _bottom = (position?.y - 1) * 64;

    const _style = {
        ...style,
        position: "absolute",
        width: `${width}px`,
        height: `${height}px`,
        bottom: `${_bottom}px`,
        left: `${_left}px`
    }

    return (
        <div key={index} className={`tile-container ${piece.name} ${isSelected ? "select" : ""}`} ref={setNodeRef} style={_style}  >
            {isSelected && <Modal tile_name={piece.name} rotation={rotation} />}
            {piece.pieces.map((e, i) => {
                if (piece.rotation === e.rotation)
                    return (
                        <>
                            {
                                e.tiles.map((o, ind) => <Pieces piece={o} onclick={() => dispatch({ type: "SeletTile", tile: piece.name })} index={ind} listeners={listeners} attributes={attributes} />)
                            }
                        </>
                    )
            })}
        </div>
    )
}

function Pieces({ piece, onclick, index, listeners, attributes }) {

    const stylePiece = {
        position: "absolute",
        left: `${(piece.x - 1) * 64}px`,
        bottom: `${(piece.y - 1) * 64}px`,
        borderColor: piece.img.includes("box") ? (piece.has_gat ? "red" : "transparent") : "transparent"
    }

    return (
        <div style={stylePiece} className={`piece ${piece.img.includes("box") ? "box" : "tile"}`} onClick={onclick}  >
            <img key={index} src={`/images/${piece.img}.png`} />
        </div>
    )
}

function Modal({ tile_name, rotation }: { tile_name: string, rotation: 0 | 90 | 180 | 270 }) {
    return (
        <div className="conatiner-btn" >
            <buttom className="btn rotate-right" onClick={() => dispatch({ type: "ChangeRotation", rotation: (rotation + 90 > 270 ? 0 : rotation + 90), tile_name })} >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" /></svg>
            </buttom>
            <buttom className="btn insert" onClick={() => dispatch({ type: "SeletTile", tile: undefined })}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" /></svg>
            </buttom>
            <buttom className="btn rotate-left" onClick={() => dispatch({ type: "ChangeRotation", rotation: (rotation - 90 < 0 ? 270 : rotation - 90), tile_name })} >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>
            </buttom>
        </div >
    )
}