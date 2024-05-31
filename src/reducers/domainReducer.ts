import { Point } from "../models/Point"
import { Grid } from "../models/Grid"
import { GatInBox } from "../models/GatInBox"
import { Tile } from "../models/Tile"
import { selectAll } from "../models/SelectAll"
import { Level, levelState } from "../models/Level.ts"
import { levelBuildHelper } from "../helpers/levelBuilderFunctionHelper"
import pieces from "../assets/jsons/pieces.json"
import levels from "../assets/jsons/levels.json"
import { pieceShadowPosition } from "../helpers/playFunctionHelper.ts"
import { getTileIndexByPoint, getIndexByPoint } from "../helpers/gridFunctionHelper"
import { checkBoxesThatChangeImage, getShadowForSelectPiece, getIndexOfAllMosaic, checkCollisionsForPartDeselection } from "../helpers/reducerFunctionHelper.ts"

type Action =
    { type: "InitializeGame", level: number, virtualGrid: (Grid & null)[25], tiles_position: Tile[4] } |
    { type: "ChangeRotation", rotation: 0 | 90 | 180 | 270, tile_name: string } |
    { type: "SeletTile", tile: Tile } |
    { type: "DeseletTile" } |
    { type: "GameReset" } |
    { type: "Move", position: Point, tile: string } |
    { type: "ChangeEditedGrids", gridIds: any }
    ;

export default function domainReducer(state: GetBox, actions: Action) {
    const _actions = {
        //inicializa cada nivel
        InitializeGame: () => {
            const put = {
                playView: true,
                levelsView: false,
                movements: 0,
                gatsInBixes: [],
                selectAll: selectAll.none,
                boxChangeImg: [],
                shadow_in_grid: [],
                confetti: false,
                tile_seleted: undefined,
                level: actions.level,
                virtualGrid: actions.virtualGrid,
                tiles_position: actions.tiles_position
            }

            return { ...state, ...put }
        },
        //
        // rota la pieza
        ChangeRotation: () => {
            const tiles_position = structuredClone(state.tiles_position);

            tiles_position[actions.tile_name].rotation = actions.rotation;
            //funcionalidades a tener en cuenta al momento de rotar
            const obj = () => {
                let gatsInBixes = structuredClone(state.gatsInBixes);
                const virtualGrid = structuredClone(state.virtualGrid);
                const tile_seleted = structuredClone(state.tile_seleted);
                const boxChangeImg = structuredClone(state.boxChangeImg);

                const release = checkCollisionsForPartDeselection(tile_seleted.name, tiles_position, virtualGrid);
                const newBoxChangeImg = checkBoxesThatChangeImage(tile_seleted, tiles_position, virtualGrid, boxChangeImg);
                gatsInBixes = checkCatAndBoxCollisions(tile_seleted.name, gatsInBixes, tiles_position, virtualGrid);

                const shadow_in_grid = getShadowForSelectPiece({ ...tiles_position[actions.tile_name], name: actions.tile_name })

                return { gatsInBixes, release, shadow_in_grid, boxChangeImg: newBoxChangeImg }
            }

            return { ...state, ...obj(), tiles_position };
        },
        //
        //selecciona una pieza
        SeletTile: () => {
            const virtualGrid = structuredClone(state.virtualGrid);
            // let old_tile_seleted = structuredClone(state.old_tile_seleted);
            let release: boolean = state.release;
            let tile_seleted: Tile = state.tile_seleted;

            let newgrid = removePieceForGrid(virtualGrid, actions.tile.name);

            //funcionalidades a tener en cuenta al momento de rotar
            const obj = () => {
                if (tile_seleted === undefined) return {}

                const tiles_position = structuredClone(state.tiles_position);
                const boxChangeImg = structuredClone(state.boxChangeImg);
                let gatsInBixes = structuredClone(state.gatsInBixes);
                let levels = structuredClone(state.levels);
                let movements = state.movements;
                let confetti: boolean = false;

                if (!release) {
                    tiles_position[tile_seleted.name] = tile_seleted;
                }

                gatsInBixes = checkCatAndBoxCollisions(tile_seleted.name, gatsInBixes, tiles_position, virtualGrid);
                newgrid = insertPieceInVictualGrid(newgrid, { ...tiles_position[tile_seleted.name], name: tile_seleted.name });
                const newBoxChangeImg = checkBoxesThatChangeImage(tile_seleted, tiles_position, virtualGrid, boxChangeImg);

                if (release) {
                    const point = tiles_position[tile_seleted.name].point;
                    const old_point = tile_seleted.point;
                    const rotation = tiles_position[tile_seleted.name].rotation;
                    const old_rotation = tile_seleted.rotation;

                    if (JSON.stringify(point) != JSON.stringify(old_point) || rotation !== old_rotation) {
                        movements++;
                    }

                    if (gatsInBixes.length === 5) {
                        confetti = completedLevel(state.level, levels)
                    }
                }

                return {
                    gatsInBixes,
                    boxChangeImg: newBoxChangeImg,
                    movements,
                    confetti,
                    levels,
                    tiles_position
                }
            }

            return {
                ...state,
                ...obj(),
                virtualGrid: newgrid,
                release: true,
                tile_seleted: actions.tile,
                shadow_in_grid: getShadowForSelectPiece(actions.tile)
            };
        },
        //
        //deselecciona la pieza
        DeseletTile: () => {

            //funcionalidades a tener en cuenta al momento de rotar
            const obj = () => {
                let gatsInBixes = structuredClone(state.gatsInBixes);
                const tiles_position = structuredClone(state.tiles_position);
                const boxChangeImg = structuredClone(state.boxChangeImg);
                let levels = structuredClone(state.levels);
                const tile_seleted = state.tile_seleted;
                const virtualGrid = state.virtualGrid;
                let movements = state.movements;
                let confetti = false;

                if (tile_seleted) {
                    gatsInBixes = checkCatAndBoxCollisions(tile_seleted.name, gatsInBixes, tiles_position, virtualGrid);

                    const newgrid = insertPieceInVictualGrid(virtualGrid, { ...tiles_position[tile_seleted.name], name: tile_seleted.name });
                    const newBoxChangeImg = checkBoxesThatChangeImage(tile_seleted, tiles_position, virtualGrid, boxChangeImg);

                    const point = tiles_position[tile_seleted.name].point;
                    const old_point = tile_seleted.point;
                    const rotation = tiles_position[tile_seleted.name].rotation;
                    const old_rotation = tile_seleted.rotation;

                    if (JSON.stringify(point) != JSON.stringify(old_point) || rotation !== old_rotation) {
                        movements++;
                    }

                    if (gatsInBixes.length === 5) {
                        confetti = completedLevel(state.level, levels)
                    }

                    return {
                        movements,
                        confetti,
                        levels,
                        gatsInBixes,
                        shadow_in_grid: [],
                        boxChangeImg: newBoxChangeImg,
                        virtualGrid: newgrid,
                    };
                }

                return {}
            }

            return {
                ...state,
                ...obj(),
                old_tile_seleted: undefined,
                tile_seleted: undefined,
            };
        },
        //
        //movimientos dw la pieza
        Move: () => {
            const tiles_position = structuredClone(state.tiles_position);

            tiles_position[actions.tile].point = actions.position;

            //funcionalidades a tener en cuenta al momento de rotar
            const obj = () => {
                const tile_seleted = structuredClone(state.tile_seleted);
                let virtualGrid = structuredClone(state.virtualGrid);
                let gatsInBixes = structuredClone(state.gatsInBixes);
                let boxChangeImg = structuredClone(state.boxChangeImg);

                const newBoxChangeImg = checkBoxesThatChangeImage(tile_seleted, tiles_position, virtualGrid, boxChangeImg);

                const release = checkCollisionsForPartDeselection(tile_seleted.name, tiles_position, virtualGrid);
                gatsInBixes = checkCatAndBoxCollisions(tile_seleted.name, gatsInBixes, tiles_position, virtualGrid);

                return { gatsInBixes, boxChangeImg: newBoxChangeImg, release }
            }

            return { ...state, ...obj(), tiles_position }

        },
        //
        //cambia el grid editado
        ChangeEditedGrids: () => {
            return { ...state, shadow_in_grid: [...actions.gridIds] }
        },
        //
        //reset levels
        GameReset: () => {

            const put = {
                movements: 0,
                gatsInBixes: [],
                boxChangeImg: [],
                shadow_in_grid: [],
                tile_seleted: undefined,
                menuGame: false,
                confetti: false,
                selectAll: selectAll.none,
                ...levelBuildHelper(state.level)
            }

            return { ...state, ...put }
        },
        //
        default: () => null
    };

    return (_actions[actions.type] || _actions["default"])();
}

function completedLevel(level: number, levels: Level[]) {
    const confetti = true;
    levels[level - 1] = { level: level - 1, state: levelState.completed };

    const index = levels.findIndex(e => e.state === levelState.desactivated)
    levels[index] = { level: levels[index].level, state: levelState.activated };

    return confetti;
}

function insertPieceInVictualGrid(virtualGrid: Grid[25], tile_seleted: Tile) {
    //add tiles position in the victual virtualGrid

    const index = getIndexByPoint({ point: { x: tile_seleted.point.x + 1, y: tile_seleted.point.y + 1 } });

    const piecesTiles: Tesserae[] = pieces.find((e: Piece) => e.name === tile_seleted.name).tiles
    const tiles: Mosaic[] = piecesTiles.find((e: Tesserae) => e.rotation === tile_seleted.rotation).tiles;
    const indexs = tiles.map((e: Mosaic) => getTileIndexByPoint({ x: e.x, y: e.y }));

    indexs.forEach((i: number) => {
        if (virtualGrid[index + (i)]?.hasGat === true) {
            //add
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
            //remove
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

    return virtualGrid;
}

function removePieceForGrid(virtualGrid: Grid[25], tile_name: string) {
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

function checkCatAndBoxCollisions(tile_selected_name, gatsInBixes, tiles_position, virtualGrid) {
    let newGatsInBixes = structuredClone(gatsInBixes);
    const mosaicIndex = getIndexOfAllMosaic(tile_selected_name, tiles_position);
    const newMosaicIndex = mosaicIndex.filter(e => e.isBox === true);

    let gpiMatched = false; // Variable para controlar si se encontró al menos una coincidencia

    virtualGrid.filter(vg => vg?.hasGat === true)
        .forEach(vg => {
            const gpi = getIndexByPoint(vg);
            newMosaicIndex.forEach(mi => {
                if (gpi === mi.index) {
                    gpiMatched = true; // Se encontró una coincidencia
                    if (!newGatsInBixes.some(obj => obj.gat === vg.data)) {
                        newGatsInBixes.push({ gat: vg.data, box: tile_selected_name });
                    }
                }
            });

            // Si no se encontró coincidencia, eliminar el objeto
            if (!gpiMatched) {
                const indexToRemove = newGatsInBixes.findIndex(obj => obj.gat === vg.data && obj.box === tile_selected_name);
                if (indexToRemove !== -1) {
                    newGatsInBixes.splice(indexToRemove, 1);
                }
            }

            // Reiniciar la variable para la próxima iteración
            gpiMatched = false;
        });

    return newGatsInBixes;
}

function ShowVictualGrid(newgrid) {
    const matriz = [];
    for (let i = 0; i < 5; i++) {
        matriz.push(newgrid.slice(i * 5, (i + 1) * 5).map(m => m?.data));
    }
    console.table(matriz);
}