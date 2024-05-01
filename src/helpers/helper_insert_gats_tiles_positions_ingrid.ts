import levers from "../../public/jsons/levers.json"
import { Piece } from "../models/piece.ts"

export function helperInsertGatsTilesPositionsInGrid(pieces: Piece) {
    const grid = [];
    levers[0].gats_position.forEach(e =>
        grid[getIndexByPoint(e)] = {
            point: e.point,
            hasGat: true,
            hasShadow: false,
            hasTile: false,
        }
    )

    Reflect.ownKeys(levers[0].tiles_position).forEach(key =>
        grid[getIndexByPoint(levers[0].tiles_position[key])] = {
            point: levers[0].tiles_position[key].point,
            hasGat: false,
            hasShadow: false,
            hasTile: true,
        }
    )

    return grid;
}


// Calcular del indice correspondiente según las cordenadas dadas;
function getIndexByPoint(coord) {
    return ((5 - coord.point.y) * 5 + coord.point.x) - 1;
}
