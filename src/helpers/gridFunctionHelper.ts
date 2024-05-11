import levels from "../assets/jsons/levels.json"
import pieces from "../assets/jsons/pieces.json"
import { Piece, Tesserae } from "../models/Piece.ts"
import { Point } from "../models/Point.ts"
import { Grid } from "../models/Grid.ts"

//add element position in the victual grid
export function insertGatsTilesPositionsInGridHelper(level: number): (Grid & null)[] {
    const grid: (Grid & null)[] = new Array(24).fill(null)

    //add gats position in the victual grid
    levels[level].gats_position.forEach(e =>
        grid[getIndexByPoint(e)] = {
            point: e.point,
            hasGat: true,
            hasShadow: false,
            hasTile: false,
            hasBox: false,
            data: e
        }
    )

    //add tiles position in the victual grid
    Reflect.ownKeys(levels[level].tiles_position).forEach((key: string) => {
        const point: Point = levels[0].tiles_position[key].point;
        const index = getIndexByPoint({ point: { x: point.x + 1, y: point.y + 1 } });
        const rotation = levels[0].tiles_position[key].rotation;
        const piecesTiles: Tesserae[] = pieces.find((e: Piece) => e.name === key).tiles
        const tiles: Mosaic[] = piecesTiles.find((e: Tesserae) => e.rotation === rotation).tiles;
        const indexs = tiles.map((e: Mosaic) => getTileIndexByPoint({ x: e.x, y: e.y }));

        indexs.forEach((i: number) => {
            grid[index + (i)] = {
                point: levels[level].tiles_position[key].point,
                hasGat: false,
                hasShadow: false,
                hasTile: true,
                hasBox: false,
                data: key
            }
        })
    })

    return grid;
}

// Calcula el indice correspondiente según las cordenadas dadas;
export function getIndexByPoint(coord) {
    return ((5 - coord.point.y) * 5 + coord.point.x) - 1;
}

// Calcula el indice correspondiente de un tile de una pieza según las cordenadas dadas y el tipo de pieza;
export function getTileIndexByPoint(point: Point) {
    return (1 * point.x) - (5 * point.y);
}