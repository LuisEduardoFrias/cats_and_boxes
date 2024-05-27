import { getTileIndexByPoint, getIndexByPoint } from "../helpers/gridFunctionHelper.ts"
import { pieceShadowPosition } from "../helpers/playFunctionHelper.ts"
import pieces from "../assets/jsons/pieces.json"
import { Tile } from "../models/Tile.ts"
import { Grid } from "../models/Grid.ts"

export function handleCollisionWithGats(pieces, gats_position, seleted_tile, tile_name) {

    //alert("colition-pieces: " + JSON.stringify(pieces, null, 2))
    const piece_index = pieces.findIndex(e => e.name === tile_name);
    const index = pieces[piece_index].pieces.findIndex(e => e.rotation === seleted_tile.rotation);
    const boxes = pieces[piece_index].pieces[index].tiles.filter(e => e.img.includes("box"));

    for (let j = 0; j < boxes.length; j++) {
        const box_x = (seleted_tile.point.x + boxes[j].x) - 1;
        const box_y = (seleted_tile.point.y + boxes[j].y) - 1;

        for (let i = 0; i < gats_position.length; i++) {
            if (gats_position[i].point.x == box_x && gats_position[i].point.y == box_y) {
                pieces[piece_index].pieces[index].tiles.filter(e => e.img.includes("box"))[j].has_gat = true;
                break
            } else {
                pieces[piece_index].pieces[index].tiles.filter(e => e.img.includes("box"))[j].has_gat = false;
            }
        }
    }

    return pieces;
}

//verifica las colicionde de cajas y gatos para cambiar la imagen
export function checkBoxesThatChangeImage(tile_selected, tiles_position, virtualGrid, boxChangedImg) {

    const mosaicIndex = getIndexOfAllMosaic(tile_selected.name, tiles_position);

    let isBreak = false;

    for (let i = 0; i < mosaicIndex.length; i++) {
        const gridItem = virtualGrid[mosaicIndex[i].index];

        if (gridItem?.hasGat === true && mosaicIndex[i].isBox) {

            let newImg = undefined;

            if (gridItem.data.includes("gato1")) {
                newImg = "gatInBox1"
            }
            else if (gridItem.data.includes("gato2")) {
                newImg = "gatInBox2"
            }
            else if (gridItem.data.includes("gato3")) {
                newImg = "gatInBox3"
            }
            else if (gridItem.data.includes("gato4")) {
                newImg = "gatInBox4"
            }
            else if (gridItem.data.includes("gato5")) {
                newImg = "gatInBox5"
            }

            const index = boxChangedImg.findIndex(e => e.indexBox === mosaicIndex[i].index)

            if (index === -1)
                boxChangedImg.push({ ...tile_selected, indexBox: mosaicIndex[i].index, img: newImg })

            isBreak = true;
        }
    }

    if (!isBreak) {
        const index = boxChangedImg.findIndex(e => e.name === tile_selected.name)
        if (index !== -1)
            boxChangedImg.splice(index, 1);
    }

    // alert("boxes: " + JSON.stringify(boxChangedImg))

    return boxChangedImg;
}

export function getShadowForSelectPiece(tile_seleted: Tile) {
    // colocar sobra a la pieza al seleccionarla
    let sumax = 0, sumay = 0;

    if (tile_seleted.name === "t") {
        if (tile_seleted.rotation === 0) { sumax = 2; sumay = 1 }
        else if (tile_seleted.rotation === 90) { sumax = 2; sumay = 2 }
        else if (tile_seleted.rotation === 180) { sumax = 2; sumay = 2 }
        else if (tile_seleted.rotation === 270) { sumax = 1; sumay = 1 }
    }
    else if (tile_seleted.name === "l") {
        if (tile_seleted.rotation === 0) { sumax = 1; sumay = 1 }
        else if (tile_seleted.rotation === 90) { sumax = 3; sumay = 1 }
        else if (tile_seleted.rotation === 180) { sumax = 2; sumay = 3 }
        else if (tile_seleted.rotation === 270) { sumax = 1; sumay = 2 }
    }
    else if (tile_seleted.name === "j") {
        if (tile_seleted.rotation === 0) { sumax = 2; sumay = 2 }
        else if (tile_seleted.rotation === 90) { sumax = 2; sumay = 2 }
        else if (tile_seleted.rotation === 180) { sumax = 1; sumay = 2 }
        else if (tile_seleted.rotation === 270) { sumax = 2; sumay = 1 }
    }
    else if (tile_seleted.name === "z") {
        if (tile_seleted.rotation === 0) { sumax = -2; sumay = 1 }
        else if (tile_seleted.rotation === 90) { sumax = 2; sumay = 3 }
        else if (tile_seleted.rotation === 180) { sumax = 1; sumay = 2 }
        else if (tile_seleted.rotation === 270) { sumax = 3; sumay = 3 }
    }

    const index = getIndexByPoint({ point: { x: tile_seleted.point.x + sumax, y: tile_seleted.point.y + sumay } });

    return pieceShadowPosition(tile_seleted.rotation, tile_seleted.name, index)

}

export function getIndexOfAllMosaic(tile_selected_name: string, tiles_position) {
    const point: Point = tiles_position[tile_selected_name].point;
    const index = getIndexByPoint({ point: { x: point.x + 1, y: point.y + 1 } });
    const rotation = tiles_position[tile_selected_name].rotation;
    const piecesTiles: Tesserae[] = pieces.find((e: Piece) => e.name === tile_selected_name).tiles
    const tiles: Mosaic[] = piecesTiles.find((e: Tesserae) => e.rotation === rotation).tiles;

    return tiles.map((e: Mosaic) => ({ index: getTileIndexByPoint({ x: e.x, y: e.y }) + index, isBox: e.img.includes('box') }));
}

export function checkCollisionsForPartDeselection(tile_selected_name: string, tiles_position: Tile[], virtualGrid: Grid[]) {
    const mosaicIndex = getIndexOfAllMosaic(tile_selected_name, tiles_position);
    let release = true;

    for (let i = 0; i < mosaicIndex.length; i++) {

        const gridItem = virtualGrid[mosaicIndex[i]?.index];

        console.log("colicion: " + JSON.stringify(gridItem, null, 2) + " -mosaic: " + JSON.stringify(mosaicIndex[i]?.index, null, 2))
        if (gridItem?.hasTile === true || (gridItem?.hasGat === true && !mosaicIndex[i].isBox)) {
            release = false;
            break
        }

        if (gridItem === undefined) {
            console.log("colicion 2do: " + JSON.stringify(gridItem, null, 2))
            release = false;
            break;
        }
    }
    return release;
}

function ShowVictualGrid(newgrid) {
    const matriz = [];
    for (let i = 0; i < 5; i++) {
        matriz.push(newgrid.slice(i * 5, (i + 1) * 5).map(m => m?.data));
    }
    console.table(matriz);
}