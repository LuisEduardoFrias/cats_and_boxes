/***/
//import levelsJson from "../assets/jsons/levels.json"
import { Point } from "../models/Point"
import { Grid } from "../models/Grid"
import { Tile } from "../models/Tile"
import { selectAll } from "../models/SelectAll"
import { levelBuildHelper } from "../helpers/levelBuilderFunctionHelper.ts"
import {
    checkBoxesThatChangeImage,
    getShadowForSelectPiece,
    getIndexOfAllMosac,
    checkCollisionsForPartDeselection,
    completedLevel,
    insertPieceInVictualGrid,
    removePieceForGrid,
    checkCatAndBoxCollisions,
} from "../helpers/reducerFunctionHelper.ts"

type Action =
    { type: "InitializeGame", level: number, virtualGrid: (Grid & null)[25], tiles_position: Tile[4] } |
    { type: "ChangeRotation", rotation: 0 | 90 | 180 | 270, tile_name: string } |
    { type: "SelectTile", tile: Tile } |
    { type: "DeselectTile" } |
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
                catsInBoxes: [],
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
                let catsInBoxes = structuredClone(state.catsInBoxes);
                const virtualGrid = structuredClone(state.virtualGrid);
                const tile_seleted = structuredClone(state.tile_seleted);
                const boxChangeImg = structuredClone(state.boxChangeImg);

                const release = checkCollisionsForPartDeselection(tile_seleted.name, tiles_position, virtualGrid);
                const newBoxChangeImg = checkBoxesThatChangeImage(tile_seleted, tiles_position, virtualGrid, boxChangeImg);
                catsInBoxes = checkCatAndBoxCollisions(tile_seleted.name, catsInBoxes, tiles_position, virtualGrid);

                const shadow_in_grid = getShadowForSelectPiece({ ...tiles_position[actions.tile_name], name: actions.tile_name })

                return { catsInBoxes, release, shadow_in_grid, boxChangeImg: newBoxChangeImg }
            }

            return { ...state, ...obj(), tiles_position };
        },
        //
        //selecciona una pieza
        SelectTile: () => {
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
                let catsInBoxes = structuredClone(state.catsInBoxes);
                let levels = structuredClone(state.levels);
                let movements = state.movements;
                let confetti: boolean = false;

                if (!release) {
                    tiles_position[tile_seleted.name] = tile_seleted;
                }

                catsInBoxes = checkCatAndBoxCollisions(tile_seleted.name, catsInBoxes, tiles_position, virtualGrid);
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

                    if (catsInBoxes.length === 5) {
                        confetti = completedLevel(state.level, levels)
                    }
                }

                return {
                    catsInBoxes,
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
        DeselectTile: () => {

            //funcionalidades a tener en cuenta al momento de rotar
            const obj = () => {
                let catsInBoxes = structuredClone(state.catsInBoxes);
                const tiles_position = structuredClone(state.tiles_position);
                const boxChangeImg = structuredClone(state.boxChangeImg);
                let levels = structuredClone(state.levels);
                const tile_seleted = state.tile_seleted;
                const virtualGrid = state.virtualGrid;
                let movements = state.movements;
                let confetti = false;

                if (tile_seleted) {
                    catsInBoxes = checkCatAndBoxCollisions(tile_seleted.name, catsInBoxes, tiles_position, virtualGrid);

                    const newgrid = insertPieceInVictualGrid(virtualGrid, { ...tiles_position[tile_seleted.name], name: tile_seleted.name });
                    const newBoxChangeImg = checkBoxesThatChangeImage(tile_seleted, tiles_position, virtualGrid, boxChangeImg);

                    const point = tiles_position[tile_seleted.name].point;
                    const old_point = tile_seleted.point;
                    const rotation = tiles_position[tile_seleted.name].rotation;
                    const old_rotation = tile_seleted.rotation;

                    if (JSON.stringify(point) != JSON.stringify(old_point) || rotation !== old_rotation) {
                        movements++;
                    }

                    if (catsInBoxes.length === 5) {
                        confetti = completedLevel(state.level, levels)
                    }

                    return {
                        movements,
                        confetti,
                        levels,
                        catsInBoxes,
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
        //movimientos de la pieza
        Move: () => {
            const tiles_position = structuredClone(state.tiles_position);

            tiles_position[actions.tile].point = actions.position;

            //funcionalidades a tener en cuenta al momento de rotar
            const obj = () => {
                const tile_seleted = structuredClone(state.tile_seleted);
                let virtualGrid = structuredClone(state.virtualGrid);
                let catsInBoxes = structuredClone(state.catsInBoxes);
                let boxChangeImg = structuredClone(state.boxChangeImg);

                const newBoxChangeImg = checkBoxesThatChangeImage(tile_seleted, tiles_position, virtualGrid, boxChangeImg);

                const release = checkCollisionsForPartDeselection(tile_seleted.name, tiles_position, virtualGrid);
                catsInBoxes = checkCatAndBoxCollisions(tile_seleted.name, catsInBoxes, tiles_position, virtualGrid);

                return { catsInBoxes, boxChangeImg: newBoxChangeImg, release }
            }

            return { ...state, ...obj(), tiles_position }

        },
        //
        //cambia el grid editado
        ChangeEditedGrids: () => {
            return { ...state, shadow_in_grid: [...actions.gridIds] }
        },
        //
        //resetear nivel
        GameReset: () => {

            const put = {
                movements: 0,
                catsInBoxes: [],
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

/*
function ShowVictualGrid(newgrid) {
    const matriz = [];
    for (let i = 0; i < 5; i++) {
        matriz.push(newgrid.slice(i * 5, (i + 1) * 5).map(m => m?.data));
    }
    console.table(matriz);
}
*/