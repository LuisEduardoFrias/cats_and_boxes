import levers from "../assets/jsons/levers.json"
import pieces from "../assets/jsons/pieces.json"
import { Piece, Tesserae } from "../models/Piece.ts"
import { Point } from "../models/Point.ts"
import { Grid } from "../models/Grid.ts"

//add element position in the victual grid
export function insertGatsTilesPositionsInGridHelper(lever: number): (Grid & null)[] {
    const grid: (Grid & null)[] = new Array(24).fill(null)

    //add gats position in the victual grid
    levers[lever].gats_position.forEach(e =>
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
    Reflect.ownKeys(levers[lever].tiles_position).forEach((key: string) => {
        const point: Point = levers[0].tiles_position[key].point;
        const index = getIndexByPoint({ point: { x: point.x + 1, y: point.y + 1 } });
        const rotation = levers[0].tiles_position[key].rotation;
        const piecesTiles: Tesserae[] = pieces.find((e: Piece) => e.name === key).tiles
        const tiles: Mosaic[] = piecesTiles.find((e: Tesserae) => e.rotation === rotation).tiles;
        const indexs = tiles.map((e: Mosaic) => getTileIndexByPoint({ x: e.x, y: e.y }));

        indexs.forEach((i: number) => {
            grid[index + (i)] = {
                point: levers[lever].tiles_position[key].point,
                hasGat: false,
                hasShadow: false,
                hasTile: true,
                hasBox: false,
                data: key
            }
        })
    })
//hola
    return grid;
}

// Calcular del indice correspondiente según las cordenadas dadas;
function getIndexByPoint(coord) {
    return ((5 - coord.point.y) * 5 + coord.point.x) - 1;
}

// Calcular del indice correspondiente según las cordenadas dadas;
function getTileIndexByPoint(point: Point) {
    return (1 * point.x) - (5 * point.y);
}