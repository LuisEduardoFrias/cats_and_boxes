import levels from "../assets/jsons/levels.json"
import pieces from "../assets/jsons/pieces.json"
import { Piece, Tesserae } from "../models/Piece.ts"
import { Point } from "../models/Point.ts"
import { Grid } from "../models/Grid.ts"

//add element position in the victual virtualGrid
export function insertCatsTilesPositionsInGridHelper(level: number): (Grid & null)[] {
    const virtualGrid: (Grid & null)[] = new Array(25).fill(null)
    //add gats position in the victual virtualGrid

    levels[level].cats_position.forEach(e =>
        virtualGrid[getIndexByPoint(e)] = {
            point: e.point,
            hasCat: true,
            hasShadow: false,
            hasTile: false,
            hasBox: false,
            data: e.name
        })

    //add tiles position in the victual virtualGrid
    Reflect.ownKeys(levels[level].tiles_position).forEach((key: string) => {
        const point: Point = levels[level].tiles_position[key].point;
        const index = getIndexByPoint({ point: { x: point.x + 1, y: point.y + 1 } });
        const rotation = levels[level].tiles_position[key].rotation;
        const piecesTiles: Tesserae[] = pieces.find((e: Piece) => e.name === key).tiles
        const tiles: Mosaic[] = piecesTiles.find((e: Tesserae) => e.rotation === rotation).tiles;
        const indexs = tiles.map((e: Mosaic) => getTileIndexByPoint({ x: e.x, y: e.y }));

        indexs.forEach((i: number) => {
            virtualGrid[index + (i)] = {
                point: levels[level].tiles_position[key].point,
                hasCat: false,
                hasShadow: false,
                hasTile: true,
                hasBox: false,
                data: key
            }
        })
    })

    return virtualGrid;
}

// Calcula el indice correspondiente según las cordenadas dadas;
export function getIndexByPoint(coord) {
    return (((5 - coord.point.y) * 5 + coord.point.x) - 1);
}

// Calcula el indice correspondiente de un tile de una pieza según las cordenadas dadas y el tipo de pieza;
export function getTileIndexByPoint(point: Point) {
    return (1 * point.x) - (5 * point.y);
}