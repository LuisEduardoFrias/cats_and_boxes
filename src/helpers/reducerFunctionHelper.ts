/***/
import pieces from "../assets/jsons/pieces.json"
import levels from "../assets/jsons/levels.json"
import { Grid } from "../models/Grid"
import { Tile } from "../models/Tile"
import { Level, levelState } from "../models/Level.ts"
import { pieceShadowPosition } from "../helpers/playFunctionHelper.ts"
import { getTileIndexByPoint, getIndexByPoint } from "../helpers/gridFunctionHelper"

export function handleCollisionWithGats(pieces, cats_position, seleted_tile, tile_name) {

    //alert("colition-pieces: " + JSON.stringify(pieces, null, 2))
    const piece_index = pieces.findIndex(e => e.name === tile_name);
    const index = pieces[piece_index].pieces.findIndex(e => e.rotation === seleted_tile.rotation);
    const boxes = pieces[piece_index].pieces[index].tiles.filter(e => e.img.includes("box"));

    for (let j = 0; j < boxes.length; j++) {
        const box_x = (seleted_tile.point.x + boxes[j].x) - 1;
        const box_y = (seleted_tile.point.y + boxes[j].y) - 1;

        for (let i = 0; i < cats_position.length; i++) {
            if (cats_position[i].point.x == box_x && cats_position[i].point.y == box_y) {
                pieces[piece_index].pieces[index].tiles.filter(e => e.img.includes("box"))[j].has_cat = true;
                break
            } else {
                pieces[piece_index].pieces[index].tiles.filter(e => e.img.includes("box"))[j].has_cat = false;
            }
        }
    }

    return pieces;
}

//verifica las colicionde de cajas y cats para cambiar la imagen
export function checkBoxesThatChangeImage(tile_selected, tiles_position, virtualGrid, boxChangedImg) {

    const mosaicIndex = getIndexOfAllMosaic(tile_selected.name, tiles_position);

    let isBreak = false;

    for (let i = 0; i < mosaicIndex.length; i++) {
        const gridItem = virtualGrid[mosaicIndex[i].index];

        if (gridItem?.hasCat === true && mosaicIndex[i].isBox) {

            let newImg = undefined;

            if (gridItem.data.includes("cat1")) {
                newImg = "catInBox1"
            }
            else if (gridItem.data.includes("cat2")) {
                newImg = "catInBox2"
            }
            else if (gridItem.data.includes("cat3")) {
                newImg = "catInBox3"
            }
            else if (gridItem.data.includes("cat4")) {
                newImg = "catInBox4"
            }
            else if (gridItem.data.includes("cat5")) {
                newImg = "catInBox5"
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

        ////console.log("colicion: " + JSON.stringify(gridItem, null, 2) + " -mosaic: " + JSON.stringify(mosaicIndex[i]?.index, null, 2))
        if (gridItem?.hasTile === true || (gridItem?.hasCat === true && !mosaicIndex[i].isBox)) {
            release = false;
            break
        }

        if (gridItem === undefined) {
            ////console.log("colicion 2do: " + JSON.stringify(gridItem, null, 2))
            release = false;
            break;
        }
    }
    return release;
}

export function completedLevel(level: number, levels: Level[]) {
    const confetti = true;
    levels[level - 1] = { level: level - 1, state: levelState.completed };

    const index = levels.findIndex(e => e.state === levelState.desactivated)
    levels[index] = { level: levels[index].level, state: levelState.activated };

    return confetti;
}

export function insertPieceInVictualGrid(virtualGrid: Grid[25], tile_seleted: Tile) {
    //add tiles position in the victual virtualGrid

    const index = getIndexByPoint({ point: { x: tile_seleted.point.x + 1, y: tile_seleted.point.y + 1 } });

    const piecesTiles: Tesserae[] = pieces.find((e: Piece) => e.name === tile_seleted.name).tiles
    const tiles: Mosaic[] = piecesTiles.find((e: Tesserae) => e.rotation === tile_seleted.rotation).tiles;
    const indexs = tiles.map((e: Mosaic) => getTileIndexByPoint({ x: e.x, y: e.y }));

    indexs.forEach((i: number) => {
        if (virtualGrid[index + (i)]?.hasCat === true) {
            //add
            virtualGrid[index + (i)] = {
                point: virtualGrid[index + (i)].point,
                hasCat: true,
                hasShadow: false,
                hasTile: true,
                hasBox: false,
                data: `${virtualGrid[index + (i)].data}-${tile_seleted.name}`
            }
        }
        else {
            //remove
            virtualGrid[index + (i)] = {
                point: tile_seleted.point,
                hasCat: false,
                hasShadow: false,
                hasTile: true,
                hasBox: false,
                data: tile_seleted.name
            }
        }
    })

    return virtualGrid;
}

export function removePieceForGrid(virtualGrid: Grid[25], tile_name: string) {
    //remove piece of the virtualGrid
    return virtualGrid.map((gd: Grid) => {
        if (gd?.data.includes(tile_name)) {
            if (gd?.hasCat) {
                gd.hasTile = false;
                gd.data = gd.data.replace(`-${tile_name}`, "")
                return gd;
            } else {
                return null;
            }
        }
        else {
            return gd;
        }
    })
}

export function checkCatAndBoxCollisions(tile_selected_name, catsInBoxes, tiles_position, virtualGrid) {
    let newcatsInBoxes = structuredClone(catsInBoxes);
    const mosaicIndex = getIndexOfAllMosaic(tile_selected_name, tiles_position);
    const newMosaicIndex = mosaicIndex.filter(e => e.isBox === true);

    let gpiMatched = false; // Variable para controlar si se encontró al menos una coincidencia

    virtualGrid.filter(vg => vg?.hasCat === true)
        .forEach(vg => {
            const gpi = getIndexByPoint(vg);
            newMosaicIndex.forEach(mi => {
                if (gpi === mi.index) {
                    gpiMatched = true; // Se encontró una coincidencia
                    if (!newcatsInBoxes.some(obj => obj.cat === vg.data)) {
                        newcatsInBoxes.push({ cat: vg.data, box: tile_selected_name });
                    }
                }
            });

            // Si no se encontró coincidencia, eliminar el objeto
            if (!gpiMatched) {
                const indexToRemove = newcatsInBoxes.findIndex(obj => obj.cat === vg.data && obj.box === tile_selected_name);
                if (indexToRemove !== -1) {
                    newcatsInBoxes.splice(indexToRemove, 1);
                }
            }

            // Reiniciar la variable para la próxima iteración
            gpiMatched = false;
        });

    return newcatsInBoxes;
}

export function ShowVictualGrid(newgrid) {
    const matriz = [];
    for (let i = 0; i < 5; i++) {
        matriz.push(newgrid.slice(i * 5, (i + 1) * 5).map(m => m?.data));
    }
    ////console.table(matriz);
}