import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import pieces from "../../public/jsons/pieces.json"
import "../styles/tiles.css"

interface ITilesProps {
    tilesPositions: object
}

export default function Tiles({ tilesPositions }: ITilesProps) {
    return (
        <>
            {pieces.map((e, index: number) => <Draw index={index} rotation={tilesPositions[e.name].rotation} position={tilesPositions[e.name].point} tile={e} />)}
        </>
    )
}

function Draw({ tile, index, rotation, position }) {
    const [select, setSelect] = useState(false)

    tile.rotation = rotation;

    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: tile.name });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    const width = rotation === 0 || rotation === 180 ? tile.size.horizontal.width : tile.size.vertical.width;
    const height = rotation === 0 || rotation === 180 ? tile.size.horizontal.height : tile.size.vertical.height;
    const _left = (position.x - 1) * 64;
    const _bottom = (position.y - 1) * 64;

    const _style = {
        ...style,
        position: "absolute",
        width: `${width}px`,
        height: `${height}px`,
        bottom: `${_bottom}px`,
        left: `${_left}px`
    }

    return (
        <div key={index} onClick={() => { setSelect(true) }} className={`tile-container ${tile.name} ${select ? "select" : ""}`} ref={setNodeRef} style={_style}  >
            {tile.pieces.map((e, i) => {
                if (tile.rotation === e.rotation)
                    return (
                        <>
                            {
                                e.tiles.map((o, ind) => <Pieces piece={o} index={ind} listeners={listeners} attributes={attributes} />)
                            }
                        </>
                    )
            })}
        </div>
    )
}

function Pieces({ piece, index, listeners, attributes }) {

    const _styleBox = {
        position: "absolute",
        left: `${(piece.x - 1) * 64}px`,
        bottom: `${(piece.y - 1) * 64}px`
    }

    return (
        <div style={_styleBox} className={`tile`} {...listeners} {...attributes} >
            <img key={index} src={`/images/${piece.img}.png`} />
        </div>
    )
}

function ContainerBtn() {
    return (<div className="conatiner-btn">
        <buttom className="btn insert">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" /></svg>
        </buttom>
        <buttom className="btn rotate-right">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" /></svg>
        </buttom>
        <buttom className="btn rotate-left">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>
        </buttom>
    </div>)
}