import levels from "../assets/jsons/levels.json"
import { insertGatsTilesPositionsInGridHelper } from "./gridFunctionHelper"
import {Tile} from "../models/Tile.ts"
import {Grid} from "../models/Grid.ts"

export function levelBuildHelper(level: number) {
    const tiles_position: Tile[4] = levels[level].tiles_position;
    const grid: (Grid & null)[] = insertGatsTilesPositionsInGridHelper(level);

    return { tiles_position, grid }
}