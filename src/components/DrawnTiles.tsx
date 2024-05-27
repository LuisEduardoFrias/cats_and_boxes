import { useEffect } from 'react'
import { useDraggable } from '@dnd-kit/core'
//import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import pieces from "../assets/jsons/pieces.json"
import { CSS } from '@dnd-kit/utilities';
import { useSubscribeState, dispatch } from "../subscribe_state/index"
import { Point } from "../models/Point"
import { Tile } from "../models/Tile"
import { Piece } from "../models/Piece"
import { getTileIndexByPoint, getIndexByPoint } from "../helpers/gridFunctionHelper.ts"
import "../styles/components/tiles.css"

export default function DrawnTiles() {
    const [{ tile_seleted, boxChangeImg, tiles_position, release, virtualGrid }, _] = useSubscribeState(["tile_seleted", "boxChangeImg", "tiles_position", "release"])

    return (
        <>
            {pieces.map((piece: Piece, index: number) => <DrawTile
                key={index}
                index={index}
                boxChangeImg={boxChangeImg}
                piece={piece}
                release={release}
                tile_seleted={tile_seleted?.name}
                tiles_position={tiles_position}
            />)}
        </>
    )
}


type TDrawTileProps = {
    piece: Piece,
    index: number,
    release: boolean,
    tile_seleted: string,
    tiles_position: any
}

//tile
function DrawTile({ piece, boxChangeImg, index, release, tile_seleted, tiles_position }: TDrawTileProps) {

    //console.log("DrawTile boxChangeImg: " + JSON.stringify(boxChangeImg))

    const isSelected = piece.name === tile_seleted;
    const rotation = tiles_position[piece.name]?.rotation;
    const point = tiles_position[piece.name]?.point;

    piece.rotation = rotation;
    const width = rotation === 0 || rotation === 180 ? piece.size.horizontal.width : piece.size.vertical.width;
    const height = rotation === 0 || rotation === 180 ? piece.size.horizontal.height : piece.size.vertical.height;
    const _left = ((point?.x) * 64);
    const _bottom = ((point?.y) * 64);

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: piece.name,
        data: {
            pieces: piece.tiles.filter(e => e.rotation === rotation)[0],
            width,
            height
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    const tileStyle = {
        ...style,
        position: "absolute",
        width: `${0}px`,
        height: `${0}px`,
        bottom: `${_bottom}px`,
        left: `${_left}px`,
        border: "0px solid yellow"
    }

    const getSelectPiece = isSelected ? "tile-select" : (tile_seleted !== undefined ? "no-tile-select" : "");

    return (
        <div key={index} tabindex={index} className={`tile-container ${piece.name} ${getSelectPiece}`} style={tileStyle}  >
            {isSelected && <Control tile_name={piece.name} release={release} rotation={rotation} orientation={height} />}
            {piece.tiles.map((obj, i) => rotation === obj.rotation ?
                obj.tiles.map((o, ind: number) => <Pieces
                    key={ind}
                    piece={o}
                    gatsInBexes={getImgBox(boxChangeImg, o, point, rotation, piece.name, ind)}
                    refr={setNodeRef}
                    pieceName={piece.name}
                    rotation={rotation}
                    isSelected={isSelected}
                    onclick={() => dispatch({ type: "SeletTile", tile: { name: piece.name, rotation, point } })}
                    index={ind}
                    listeners={listeners}
                    attributes={attributes} />)
                : null)}
        </div>
    )
}


function getImgBox(boxChangeImg, obj, point, rotation, pieceName, ind: number) {
    let gatsInBoxes: undefined;

    if (boxChangeImg.length > 0 && obj.img.includes("box")) {

        const index = getIndexByPoint({ point: { x: point.x + 1, y: point.y + 1 } });
        const piecesTiles: Tesserae[] = pieces.find((e: Piece) => e.name === pieceName).tiles
        const tiles: Mosaic[] = piecesTiles.find((e: Tesserae) => e.rotation === rotation).tiles;

        const boxIndex = getTileIndexByPoint({ x: tiles[ind].x, y: tiles[ind].y }) + index;

        gatsInBoxes = boxChangeImg?.find(e => e.name === pieceName && e.indexBox === boxIndex);
    }

    return gatsInBoxes?.img;
}

type TPieces = {
    piece: any,
    gatsInBexes: string | null,
    refr: any
    isSelected: boolean,
    rotation: number,
    pieceName: string,
    onclick: any,
    index: number,
    listeners: any
    attributes: any
}

//tile intermos
function Pieces({ piece, gatsInBexes, refr, isSelected, rotation, pieceName, onclick, index, listeners, attributes }: TPieces) {

    const color = pieceName === "t" ? "#1f0800" :
        (pieceName === "l" ? "#f8a007" :
            (pieceName === "j" ? "#f8a007" : "#1f0800"));

    const stylePiece = {
        position: "absolute",
        border: `0px solid `,
        left: `${(piece.x) * 64 + (isSelected ? 5:0)}px`,
        bottom: `${(piece.y) * 64 + (isSelected ? 5 : 0) }px`,
        borderWidth: "3px",
        borderStyle: "solid",
        ...getShadowByPieces(pieceName, rotation, index),
        backgroundColor: color, //piece.img.includes("box") ? (piece.has_gat ? lcolor : color) : color,
    }

    const cn = `tile-piece ${isSelected ? "seleted_tile" : ""} ${piece.img.includes("box") ? (!isSelected ? "tile-box" : "seleted_tile") : "tile-tile"}`;
    const list = { ...(isSelected ? listeners : null) };
    const attr = { ...(isSelected ? attributes : null) };

    return (
        <div style={stylePiece} ref={refr} className={cn} onClick={onclick} {...list} {...attr} >
            {piece.img.includes("box") ? <img key={index} src={`/images/${gatsInBexes ?? piece.img}.png`} /> : null}
        </div>
    )
}


//control de rotacion
function Control({ tile_name, release, rotation, orientation }: { tile_name: string, release: boolean, rotation: 0 | 90 | 180 | 270, orientation: number }) {

    const controlStyle = {
        top: `${-orientation - 50}px`
    }

    return (
        <div className="tile-control-container" style={controlStyle} >
            <button className="tile-control-btn tile-control-rotate" onClick={() => dispatch({ type: "ChangeRotation", rotation: (rotation + 90 > 270 ? 0 : rotation + 90), tile_name })} >
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" /></svg>
                </div>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>
                </div>
            </button>
            <button disabled={!release} className={`tile-control-btn tile-control-insert`} onClick={() => dispatch({ type: "DeseletTile", tile: undefined })}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" /></svg>
            </button>
        </div >
    )
}

function getShadowByPieces(pieceName, rotation, index) {
    const tcolor = "#f8a007";
    const lcolor = "#1f0800";
    const jcolor = "#1f0800";
    const zcolor = "#f8a007";

    const getBorderStyle = (borderTopColor, borderRightColor, borderBottomColor, borderLeftColor, margin, width, height, borderRadius) => {
        return {
            borderTopColor,
            borderRightColor,
            borderBottomColor,
            borderLeftColor,
            margin,
            width,
            height,
            borderRadius
        };
    };

    if (pieceName === "t") {
        if (rotation === 0) {
            if (index === 0) { return getBorderStyle(tcolor, "transparent", tcolor, tcolor, "5px 0px 5px 5px", "59px", "54px", "5px 0px 0px 5px "); }
            else if (index === 1) { return getBorderStyle(tcolor, tcolor, "transparent", tcolor, "5px 5px 0px 5px", "54px", "59px", "5px 5px 0px 0px"); }
            else if (index === 2) { return getBorderStyle(tcolor, tcolor, tcolor, "transparent", "5px 5px 5px 0px", "59px", "54px", "0px 5px 5px 0px"); }
            else if (index === 3) { return getBorderStyle("transparent", "transparent", tcolor, "transparent", "0px 0px 5px 0px", "64px", "59px", "7px 7px 0px 0px"); }
        }
        else if (rotation === 90) {
            if (index === 0) { return getBorderStyle(tcolor, "transparent", tcolor, tcolor, "5px 0px 5px 5px", "59px", "54px", "5px 0 0 5px"); }
            else if (index === 1) { return getBorderStyle("transparent", tcolor, tcolor, tcolor, "0px 5px 5px 5px", "54px", "59px", "0 0 5px 5px"); }
            else if (index === 2) { return getBorderStyle(tcolor, tcolor, "transparent", tcolor, "5px 5px 0px 5px", "54px", "59px", "5px 5px 0 0"); }
            else if (index === 3) { return getBorderStyle("transparent", tcolor, "transparent", "transparent", "0px 5px 0px 0px", "59px", "64px", "7px 0 0 7px"); }
        }
        else if (rotation === 180) {
            if (index === 0) { return getBorderStyle(tcolor, "transparent", tcolor, tcolor, "5px 0px 5px 5px", "59px", "54px", "5px 0 0 5px"); }
            else if (index === 1) { return getBorderStyle("transparent", tcolor, tcolor, tcolor, "0px 5px 5px 5px", "54px", "59px", "0 0 5px 5px"); }
            else if (index === 2) { return getBorderStyle(tcolor, tcolor, tcolor, "transparent", "5px 5px 5px 0px", "59px", "54px", " 0 5px 5px 0"); }
            else if (index === 3) { return getBorderStyle(tcolor, "transparent", "transparent", "transparent", "5px 5px 0px 0px", "64px", "59px", "0 0 7px 7px"); }
        }
        else if (rotation === 270) {
            if (index === 0) { return getBorderStyle(tcolor, tcolor, "transparent", tcolor, "5px 5px 0px 5px", "54px", "59px", "5px 5px 0 0"); }
            else if (index === 1) { return getBorderStyle(tcolor, tcolor, tcolor, "transparent", "5px 5px 5px 0px", "59px", "54px", " 0 5px 5px 0"); }
            else if (index === 2) { return getBorderStyle("transparent", "transparent", "transparent", tcolor, "0px 0px 0px 5px", "59px", "64px", " 0 7px 7px 0"); }
            else if (index === 3) { return getBorderStyle("transparent", tcolor, tcolor, tcolor, "0px 5px 5px 5px", "54px", "59px", "0 0 5px 5px"); }
        }
    }
    else if (pieceName === "l") {
        if (rotation === 0) {
            if (index === 0) return getBorderStyle("transparent", lcolor, "transparent", lcolor, "0px 5px 0px 5px", "54px", "64px", "0 0");
            else if (index === 1) return getBorderStyle(lcolor, lcolor, "transparent", lcolor, "5px 5px 0px 5px", "54px", "59px", "5px 5px 0 0");
            else if (index === 2) return getBorderStyle(lcolor, lcolor, lcolor, "transparent", "5px 5px 5px 0px", "59px", "54px", "0 5px 5px 0");
            else if (index === 3) return getBorderStyle("transparent", "transparent", lcolor, lcolor, "0px 0px 5px 5px", "59px", "59px", "0 7px 0 5px");
        }
        else if (rotation === 90) {
            if (index === 0) return getBorderStyle(lcolor, "transparent", lcolor, lcolor, "5px 0px 5px 5px", "59px", "54px", "5px 0 0 5px");
            else if (index === 1) return getBorderStyle(lcolor, "transparent", lcolor, "transparent", "5px 0px 5px 0px", "64px", "54px", "0 0 0 0");
            else if (index === 2) return getBorderStyle(lcolor, lcolor, "transparent", lcolor, "5px 5px 0px 5px", "54px", "59px", "5px 5px 0 0");
            else if (index === 3) return getBorderStyle("transparent", lcolor, lcolor, "transparent", "0px 5px 5px 0px", "59px", "59px", "7px 0 5px 0");
        }
        else if (rotation === 180) {
            if (index === 0) return getBorderStyle(lcolor, "transparent", lcolor, lcolor, "5px 0px 5px 5px", "59px", "54px", "5px 0 0 5px");
            else if (index === 1) return getBorderStyle("transparent", lcolor, "transparent", lcolor, "0px 5px 0px 5px", "54px", "64px", "0 0");
            else if (index === 2) return getBorderStyle("transparent", lcolor, lcolor, lcolor, "0px 5px 5px 5px", "54px", "59px", "0 0 5px 5px");
            else if (index === 3) return getBorderStyle(lcolor, lcolor, "transparent", "transparent", "5px 5px 0px 0px", "59px", "59px", "0 5px 0 7px");
        }
        else if (rotation === 270) {
            if (index === 0) return getBorderStyle("transparent", lcolor, lcolor, lcolor, "0px 5px 5px 5px", "54px", "59px", " 0 0 5px 5px");
            else if (index === 1) return getBorderStyle(lcolor, "transparent", lcolor, "transparent", "5px 0px 5px 0px", "64px", "54px", "0 0");
            else if (index === 2) return getBorderStyle(lcolor, lcolor, lcolor, "transparent", "5px 5px 5px 0px", "59px", "54px", " 0 5px 5px 0 ");
            else if (index === 3) return getBorderStyle(lcolor, "transparent", "transparent", lcolor, "5px 0px 0px 5px", "59px", "59px", "5px 0 7px 0 ");
        }
    }
    else if (pieceName === "j") {
        if (rotation === 0) {
            if (index === 0) return getBorderStyle(jcolor, "transparent", jcolor, jcolor, "5px 0px 5px 5px", "59px", "54px", "5px 0 0 5px");
            else if (index === 1) return getBorderStyle("transparent", jcolor, jcolor, "transparent", "0px 5px 5px 0px", "59px", "59px", "7px 0 5px 0");
            else if (index === 2) return getBorderStyle(jcolor, jcolor, "transparent", jcolor, "5px 5px 0px 5px", "54px", "59px", "5px 5px 0 0");
            else if (index === 3) return getBorderStyle("transparent", jcolor, "transparent", jcolor, "0px 5px 0px 5px", "54px", "64px", " 0 0 ");
        }
        else if (rotation === 90) {
            if (index === 0) return getBorderStyle(jcolor, "transparent", jcolor, jcolor, "5px 0px 5px 5px", "59px", "54px", "5px 0 0 5px");
            else if (index === 1) return getBorderStyle(jcolor, jcolor, "transparent", "transparent", "5px 5px 0px 0px", "59px", "59px", "0 5px 0 7px");
            else if (index === 2) return getBorderStyle("transparent", jcolor, jcolor, jcolor, "0px 5px 5px 5px", "54px", "59px", "0 0 5px 5px");
            else if (index === 3) return getBorderStyle(jcolor, "transparent", jcolor, "transparent", "5px 0px 5px 0px", "64px", "54px", "0 0");
        }
        else if (rotation === 180) {
            if (index === 0) return getBorderStyle("transparent", jcolor, jcolor, jcolor, "0px 5px 5px 5px", "54px", "59px", "0 0 5px 5px");
            else if (index === 1) return getBorderStyle(jcolor, "transparent", "transparent", jcolor, "5px 0px 0px 5px", "59px", "59px", "5px 0 7px 0");
            else if (index === 2) return getBorderStyle(jcolor, jcolor, jcolor, "transparent", "5px 5px 5px 0px", "59px", "54px", " 0 5px 5px 0");
            else if (index === 3) return getBorderStyle("transparent", jcolor, "transparent", jcolor, "0px 5px 0px 5px", "54px", "64px", " 0 0 ");
        }
        else if (rotation === 270) {
            if (index === 0) return getBorderStyle("transparent", "transparent", jcolor, jcolor, "0px 0px 5px 5px", "59px", "59px", " 0 7px 0 5px");
            else if (index === 1) return getBorderStyle(jcolor, jcolor, "transparent", jcolor, "5px 5px 0px 5px", "54px", "59px", "5px 5px 0 0");
            else if (index === 2) return getBorderStyle(jcolor, jcolor, jcolor, "transparent", "5px 5px 5px 0px", "59px", "54px", " 0 5px 5px 0");
            else if (index === 3) return getBorderStyle(jcolor, "transparent", jcolor, "transparent", "5px 0px 5px 0px", "64px", "54px", "0 0 ");
        }
    }
    else if (pieceName === "z") {
        if (rotation === 0) {
            if (index === 0) return getBorderStyle(zcolor, zcolor, "transparent", "transparent", "5px 5px 0px 0px", "59px", "59px", " 0 5px 0 7px");
            else if (index === 1) return getBorderStyle("transparent", "transparent", "transparent", zcolor, "0px 0px 0px 5px", "59px", "64px", "0 7px 7px 0");
            else if (index === 2) return getBorderStyle("transparent", zcolor, zcolor, zcolor, "0px 5px 5px 5px", "54px", "59px", " 0 0 5px 5px");
            else if (index === 3) return getBorderStyle(zcolor, "transparent", zcolor, zcolor, "5px 0px 5px 5px", "59px", "54px", " 5px 0 0 5px");
            else if (index === 4) return getBorderStyle(zcolor, zcolor, zcolor, "transparent", "5px 5px 5px 0px", "59px", "54px", " 0 5px 5px 0");
        }
        else if (rotation === 90) {
            if (index === 0) return getBorderStyle(zcolor, "transparent", "transparent", zcolor, "5px 0px 0px 5px", "59px", "59px", "5px 0 7px 0");
            else if (index === 1) return getBorderStyle("transparent", "transparent", zcolor, "transparent", "0px 0px 5px 0px", "64px", "59px", "7px 7px 0 7px");
            else if (index === 2) return getBorderStyle(zcolor, zcolor, zcolor, "transparent", "5px 5px 5px 0px", "59px", "54px", " 0 5px 5px 0");
            else if (index === 3) return getBorderStyle("transparent", zcolor, zcolor, zcolor, "0px 5px 5px 5px", "54px", "59px", " 0 0 5px 5px");
            else if (index === 4) return getBorderStyle(zcolor, zcolor, "transparent", zcolor, "5px 5px 0px 5px", "54px", "59px", " 5px 5px 0 0");
        }
        else if (rotation === 180) {
            if (index === 0) return getBorderStyle(zcolor, zcolor, "transparent", zcolor, "5px 5px 0px 5px", "54px", "59px", "5px 5px 0 0");
            else if (index === 1) return getBorderStyle("transparent", zcolor, "transparent", "transparent", "0px 5px 0px 0px", "59px", "64px", "7px 0 0 7px",);
            else if (index === 2) return getBorderStyle("transparent", "transparent", zcolor, zcolor, "0px 0px 5px 5px", "59px", "59px", "0 7px 0 5px");
            else if (index === 3) return getBorderStyle(zcolor, zcolor, zcolor, "transparent", "5px 5px 5px 0px", "59px", "54px", "0 5px 5px 0");
            else if (index === 4) return getBorderStyle(zcolor, "transparent", zcolor, zcolor, "5px 0px 5px 5px", "59px", "54px", "5px 0 0 5px");
        }
        else if (rotation === 270) {
            if (index === 0) return getBorderStyle(zcolor, "transparent", zcolor, zcolor, "5px 0px 5px 5px", "59px", "54px", " 5px 0 0 5px");
            else if (index === 1) return getBorderStyle(zcolor, "transparent", "transparent", "transparent", "5px 0px 0px 0px", "64px", "59px", " 0 0 7px 7px");
            else if (index === 2) return getBorderStyle("transparent", zcolor, zcolor, "transparent", "0px 5px 5px 0px", "59px", "59px", "7px 0 5px 0 ");
            else if (index === 3) return getBorderStyle("transparent", zcolor, zcolor, zcolor, "0px 5px 5px 5px", "54px", "59px", " 0 0 5px 5px");
            else if (index === 4) return getBorderStyle(zcolor, zcolor, "transparent", zcolor, "5px 5px 0px 5px", "54px", "59px", " 5px 5px 0 0");
        }
    }

    return getBorderStyle(tcolor, "transparent", tcolor, tcolor, "5px 0px 5px 5px", "59px", "54px", "5px 0px 0px 5px ");
}