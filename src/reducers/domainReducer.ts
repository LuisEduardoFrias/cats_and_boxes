import { Point } from "../models/Point"
import { Grid } from "../models/Grid"
import { GatInBox } from "../models/GatInBox"
import { Tile } from "../models/Tile"
import pieces from "../assets/jsons/pieces.json"
import levels from "../assets/jsons/levels.json"
import { getTileIndexByPoint, getIndexByPoint } from "../helpers/gridFunctionHelper"
//import { handleCollisionWithGats } from "../helpers/helper_reducer"

type Action =
    { type: "InitializeGame", level: number, virtualGrid: (Grid & null)[25], tiles_position: Tile[4] } |
    { type: "ChangeRotation", rotation: 0 | 90 | 180 | 270, tile_name: string } |
    { type: "SeletTile", tile: string } |
    { type: "DeseletTile", tile: undefined } |
    { type: "SelectLever", level: number } |
    { type: "Move", position: Point, tile: string }
    ;

export default function domainReducer(state: GetBox, actions: Action) {
    const _actions = {
        InitializeGame: () => {
            const put = {
                viewPlay: true,
                viewLevels: false,
                movements: 0,
                gatsInBixes: [],
                confetti: false,
                tile_seleted: undefined,
                level: actions.level,
                virtualGrid: actions.virtualGrid,
                tiles_position: actions.tiles_position
            }

            return { ...state, ...put }
        },
        ChangeRotation: () => {
            const tiles_position = structuredClone(state.tiles_position);
            tiles_position[actions.tile_name].rotation = actions.rotation;

            let virtualGrid = structuredClone(state.virtualGrid);
            let gatsInBixes = structuredClone(state.gatsInBixes);
            const tile_seleted = structuredClone(state.tile_seleted);

            // virtualGrid = removePieceForGrid(virtualGrid, tile_seleted.name);

            const release = checkColitionForRelease(tile_seleted, tiles_position, virtualGrid, actions.tile_name);
            gatsInBixes = checkColitionGatWithBox(tile_seleted, gatsInBixes, tiles_position, virtualGrid);

            return { ...state, tiles_position, gatsInBixes, edited_grids: [], release };
        },
        SeletTile: () => {
            const virtualGrid = structuredClone(state.virtualGrid);
            const tiles_position = structuredClone(state.tiles_position);
            let old_tile_seleted = structuredClone(state.old_tile_seleted);
            let movements = state.movements;
            let gatsInBixes = structuredClone(state.gatsInBixes);
            let release = state.release;
            let tile_seleted = state.tile_seleted;
            let confetti = false;

            let newgrid = removePieceForGrid(virtualGrid, actions.tile.name);

            if (tile_seleted !== actions.tile) {

                if (!tile_seleted) {
                    old_tile_seleted = actions.tile;
                }

                tile_seleted = actions.tile;

                if (old_tile_seleted !== tile_seleted) {
                    if (!release) {
                        tiles_position[old_tile_seleted.name] = old_tile_seleted;
                    } else {

                        newgrid = insertPieceInVictualGrid(newgrid, { ...tiles_position[old_tile_seleted.name], name: old_tile_seleted.name }, state.level);
                        // if (!actions.tile) {

                        if ((tiles_position[tile_seleted.name].point !== tile_seleted.point) || (tiles_position[tile_seleted.name].rotation !== tile_seleted.rotation)) {
                            movements++;
                        }

                        if (gatsInBixes.length === 5) {
                            confetti = true;
                        }
                        // }
                    }
                    release = true;
                    old_tile_seleted = actions.tile;
                }
            }

            ShowVictualGrid(newgrid)
            return {
                ...state,
                release,
                old_tile_seleted,
                virtualGrid: newgrid,
                movements,
                confetti,
                tiles_position,
                tile_seleted
            };
        },
        DeseletTile: () => {
            const gatsInBixes = structuredClone(state.gatsInBixes);
            const tiles_position = structuredClone(state.tiles_position);
            const tile_seleted = state.tile_seleted;
            const virtualGrid = state.virtualGrid;
            let movements = state.movements;
            let confetti = false;

            //TODO validar si el tile se movio para marcar el movimiento
            let newgrid = [];
            if (true) {
                newgrid = insertPieceInVictualGrid(virtualGrid, { ...tiles_position[tile_seleted.name], name: tile_seleted.name }, state.level);

                //ShowVictualGrid(newgrid)
                if ((tiles_position[tile_seleted.name].point !== tile_seleted.point) || (tiles_position[tile_seleted.name].rotation !== tile_seleted.rotation)) {
                    movements++;
                }

                if (gatsInBixes.length === 5) {
                    confetti = true;
                }
            }

            return {
                ...state,
                movements,
                confetti,
                virtualGrid: newgrid,
                old_tile_seleted: undefined,
                tile_seleted: undefined,
            };
        },
        Move: () => {
            const tiles_position = structuredClone(state.tiles_position);
            let virtualGrid = structuredClone(state.virtualGrid);
            let gatsInBixes = structuredClone(state.gatsInBixes);
            const tile_seleted = structuredClone(state.tile_seleted);

            tiles_position[actions.tile].point = actions.position;

            const release = checkColitionForRelease(tile_seleted, tiles_position, virtualGrid, actions.tile);
            gatsInBixes = checkColitionGatWithBox(tile_seleted, gatsInBixes, tiles_position, virtualGrid);

            return { ...state, tiles_position, gatsInBixes, edited_grids: [], release }
        },
        ChangeEditedGrids: () => {
            //alert("ChangeEditedGrids")
            //return { ...state, edited_grids: [...actions.gridIds] }
            return state;
        },
        default: () => null
    };

    return (_actions[actions.type] || _actions["default"])();
}

function insertPieceInVictualGrid(virtualGrid: Grid[24], tile_seleted: Tile, level: number) {
    //add tiles position in the victual virtualGrid
    try {
        const index = getIndexByPoint({ point: { x: tile_seleted.point.x + 1, y: tile_seleted.point.y + 1 } });

        const piecesTiles: Tesserae[] = pieces.find((e: Piece) => e.name === tile_seleted.name).tiles
        const tiles: Mosaic[] = piecesTiles.find((e: Tesserae) => e.rotation === tile_seleted.rotation).tiles;
        const indexs = tiles.map((e: Mosaic) => getTileIndexByPoint({ x: e.x, y: e.y }));

        indexs.forEach((i: number) => {
            if (virtualGrid[index + (i)]?.hasGat === true) {
                virtualGrid[index + (i)] = {
                    point: virtualGrid[index + (i)].point,
                    hasGat: true,
                    hasShadow: false,
                    hasTile: true,
                    hasBox: false,
                    data: `${virtualGrid[index + (i)].data}-${tile_seleted.name}`
                }
            }
            else {
                virtualGrid[index + (i)] = {
                    point: tile_seleted.point,
                    hasGat: false,
                    hasShadow: false,
                    hasTile: true,
                    hasBox: false,
                    data: tile_seleted.name
                }
            }
        })
    } catch (err) { console.error(err) }

    return virtualGrid;
}

function removePieceForGrid(virtualGrid: Grid[24], tile_name: string) {
    //remove piece of the virtualGrid
    return virtualGrid.map((gd: Grid) => {
        if (gd?.data.includes(tile_name)) {
            if (gd?.hasGat) {
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

function getIndexOfAllMosaic(tile_seleted: Tile, tiles_position) {
    const point: Point = tiles_position[tile_seleted.name].point;
    const index = getIndexByPoint({ point: { x: point.x + 1, y: point.y + 1 } });
    const rotation = tiles_position[tile_seleted.name].rotation;
    const piecesTiles: Tesserae[] = pieces.find((e: Piece) => e.name === tile_seleted.name).tiles
    const tiles: Mosaic[] = piecesTiles.find((e: Tesserae) => e.rotation === rotation).tiles;

    return tiles.map((e: Mosaic) => ({ index: getTileIndexByPoint({ x: e.x, y: e.y }) + index, isBox: e.img.includes('box') }));
}

function checkColitionForRelease(tile_selected, tiles_position, virtualGrid, specificTile) {
    const mosaicIndex = getIndexOfAllMosaic(tile_selected, tiles_position, specificTile);
    let release = true;

    mosaicIndex.forEach(obj => {
        const gridItem = virtualGrid[obj.index];

        console.info("obj index: " + obj.index)
        console.info("grid item: " + JSON.stringify(gridItem))

        if (gridItem === undefined) release = false;

        if (gridItem?.hasGat === true && obj.isBox) release = true;

        if (gridItem?.hasTile === true || (gridItem?.hasGat === true && !obj.isBox)) {
            release = false;
        }

    });

    return release;
}

function checkColitionGatWithBox(tile_seleted, gatsInBixes, tiles_position, virtualGrid) {
    let newGatsInBixes = structuredClone(gatsInBixes);
    const mosaicIndex = getIndexOfAllMosaic(tile_seleted, tiles_position);
    const newMosaicIndex = mosaicIndex.filter(e => e.isBox === true);

    let gpiMatched = false; // Variable para controlar si se encontró al menos una coincidencia

    virtualGrid.filter(vg => vg?.hasGat === true)
        .forEach(vg => {
            const gpi = getIndexByPoint(vg);
            newMosaicIndex.forEach(mi => {
                if (gpi === mi.index) {
                    gpiMatched = true; // Se encontró una coincidencia
                    if (!newGatsInBixes.some(obj => obj.gat === vg.data)) {
                        newGatsInBixes.push({ gat: vg.data, box: tile_seleted.name });
                    }
                }
            });

            // Si no se encontró coincidencia, eliminar el objeto
            if (!gpiMatched) {
                const indexToRemove = newGatsInBixes.findIndex(obj => obj.gat === vg.data && obj.box === tile_seleted.name);
                if (indexToRemove !== -1) {
                    newGatsInBixes.splice(indexToRemove, 1);
                }
            }

            // Reiniciar la variable para la próxima iteración
            gpiMatched = false;
        });

    console.log("gib: " + JSON.stringify(newGatsInBixes));

    return newGatsInBixes;
}

function ShowVictualGrid(newgrid) {
    const matriz = [];
    for (let i = 0; i < 5; i++) {
        matriz.push(newgrid.slice(i * 5, (i + 1) * 5).map(m => m?.data));
    }
    console.table(matriz);
}
