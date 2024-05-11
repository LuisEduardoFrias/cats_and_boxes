import { Point } from "../models/Point"
import { Grid } from "../models/Grid"
import { Tile } from "../models/Tile"
import pieces from "../assets/jsons/pieces.json"
import levels from "../assets/jsons/levels.json"
import { getTileIndexByPoint, getIndexByPoint } from "../helpers/gridFunctionHelper"
//import { handleCollisionWithGats } from "../helpers/helper_reducer"

type Action =
    { type: "InitializeGame", level: number, grid: (Grid & null)[25], tiles_position: Tile[4] } |
    { type: "ChangeRotation", rotation: 0 | 90 | 180 | 270, tile_name: string } |
    { type: "SeletTile", tile: string | undefined } |
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
                gatsInBixes: 0,
                confetti: false,
                tile_seleted: undefined,
                level: actions.level,
                grid: actions.grid,
                tiles_position: actions.tiles_position
            }

            return { ...state, ...put }
        },
        ChangeRotation: () => {
            const tiles_position = structuredClone(state.tiles_position);
            tiles_position[actions.tile_name].rotation = actions.rotation;

            let grid = structuredClone(state.grid);
            let gatsInBixes = state.gatsInBixes;
            const tile_seleted = structuredClone(state.tile_seleted);

            // const tiles_position = structuredClone(state.tiles_position);


            grid = removePieceForGrid(grid, tile_seleted.name);

            const release = checkColitionForRelease(tile_seleted, tiles_position, grid, actions.tile_name);
            const gib = checkColitionWithGat(tile_seleted, tiles_position, grid, actions.tile_name);

            gatsInBixes += gib === -1 && gatsInBixes === 0 ? 0 : gib;


            /*  const updated_pieces = handleCollisionWithGats(
                  structuredClone(state.pieces),
                  structuredClone(state.gats_position),
                  tiles_position[actions.tile_name],
                  actions.tile_name);
  */
            //  const newState = { pieces: updated_pieces, edited_grids: [] };
            return { ...state, tiles_position, gatsInBixes, edited_grids: [], grid, release };
        },
        SeletTile: () => {
            let movements = state.movements;
            let gatsInBixes = state.gatsInBixes;

            let release = state.release;
            const grid = state.grid;
            let old_tile_seleted = state.old_tile_seleted;
            let tile_seleted = state.tile_seleted;
            const tiles_position = structuredClone(state.tiles_position);
            let confetti = false;

            if (old_tile_seleted)
                // insertPieceInVictualGrid(grid, old_tile_seleted, state.level);

                if (release) old_tile_seleted = actions.tile;

            if (!release) {
                tiles_position[old_tile_seleted.name] = old_tile_seleted;
                old_tile_seleted = actions.tile;
                release = true;
            }

            if (!actions.tile) {
                movements++;
                if (gatsInBixes === 5) {
                    confetti = true;
                }
            }

            return {
                ...state,
                release,
                old_tile_seleted,
                movements,
                confetti,
                tiles_position,
                tile_seleted: actions.tile
            };
        },
        SelectLevel: () => {
            /* const put = {
                 viewPlay: true,
                 viewLevels: false,
                 level: actions.level,
                 tiles_position: state.levers[actions.level].tiles_position,
                 gats_position: state.levers[actions.level].gats_position
             }
 
             return { ...state, ...put };*/
            alert("select lever")
        },
        Move: () => {
            const tiles_position = structuredClone(state.tiles_position);
            let grid = structuredClone(state.grid);
            let gatsInBixes = state.gatsInBixes;
            const tile_seleted = structuredClone(state.tile_seleted);

            tiles_position[actions.tile].point = actions.position;


            grid = removePieceForGrid(grid, tile_seleted.name);

            const release = checkColitionForRelease(tile_seleted, tiles_position, grid, actions.tile);
            const gib = checkColitionWithGat(tile_seleted, tiles_position, grid, actions.tile);

            gatsInBixes += gib === -1 && gatsInBixes === 0 ? 0 : gib;

            return { ...state, tiles_position, gatsInBixes, edited_grids: [], release, grid }
        },
        ChangeEditedGrids: () => {
            // console.log(JSON.stringify(state.grid, null, 2))

            return { ...state, edited_grids: [...actions.gridIds] }
        },
        default: () => null
    };

    return (_actions[actions.type] || _actions["default"])();
}

function insertPieceInVictualGrid(grid: Grid[24], tile_seleted: Tile, level: number) {
    //add tiles position in the victual grid
    const index = getIndexByPoint({ point: { x: tile_seleted.point.x + 1, y: tile_seleted.point.y + 1 } });

    const piecesTiles: Tesserae[] = pieces.find((e: Piece) => e.name === tile_seleted.name).tiles
    const tiles: Mosaic[] = piecesTiles.find((e: Tesserae) => e.rotation === tile_seleted.rotation).tiles;
    const indexs = tiles.map((e: Mosaic) => getTileIndexByPoint({ x: e.x, y: e.y }));

    indexs.forEach((i: number) => {
        grid[index + (i)] = {
            point: tile_seleted.point,
            hasGat: false,
            hasShadow: false,
            hasTile: true,
            hasBox: false,
            data: tile_seleted.name
        }
    })
}

function removePieceForGrid(grid: Grid[24], tile_name: string) {
    //remove piece of the grid
    return grid.map((gd: Grid) => {
        if (gd?.data === tile_name) {
            return null;
        }
        else {
            return gd;
        }
    })
}

function getIndexOfAllMosaic(tile_seleted: Tile, tiles_position, specificTile: string) {
    const point: Point = tiles_position[specificTile].point;
    const index = getIndexByPoint({ point: { x: point.x + 1, y: point.y + 1 } });
    const rotation = tiles_position[specificTile].rotation;
    const piecesTiles: Tesserae[] = pieces.find((e: Piece) => e.name === tile_seleted.name).tiles
    const tiles: Mosaic[] = piecesTiles.find((e: Tesserae) => e.rotation === rotation).tiles;

    return tiles.map((e: Mosaic) => ({ index: getTileIndexByPoint({ x: e.x, y: e.y }) + index, isBox: e.img.includes('box') }));
}

function checkColitionForRelease(tile_seleted: Tile, tiles_position, grid: Grid[24], specificTile: string) {
    const mosaicIndex = getIndexOfAllMosaic(tile_seleted, tiles_position, specificTile)
    let release = true;

    for (let i = 0; i < mosaicIndex.length; i++) {
        if (!mosaicIndex[i].isBox) {
            if (grid[mosaicIndex[i].index] === undefined) release = false;
            if (grid[mosaicIndex[i].index]?.hasGat === true) release = false;
            if (grid[mosaicIndex[i].index]?.hasTile === true && grid[mosaicIndex[i].index]?.data !== tile_seleted.name) release = false;
        }
    }

    return release;
}

function checkColitionWithGat(tile_seleted: Tile, tiles_position, grid: Grid[24], specificTile: string) {
    const mosaicIndex = getIndexOfAllMosaic(tile_seleted, tiles_position, specificTile)
    let gatsInBixes = 0;

    for (let i = 0; i < mosaicIndex.length; i++) {
        if (grid[mosaicIndex[i].index]?.hasGat === true) {
            gatsInBixes = 1;
        } else {
            gatsInBixes = -1;
        }
    }

    return gatsInBixes;
}
