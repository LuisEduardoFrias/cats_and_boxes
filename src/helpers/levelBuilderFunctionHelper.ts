import levels from "../assets/jsons/levels.json"
import { insertCatsTilesPositionsInGridHelper } from "./gridFunctionHelper"
import { Tile } from "../models/Tile.ts"
import { Grid } from "../models/Grid.ts"

export function levelBuildHelper(level: number) {
    const tiles_position: Tile[4] = levels[level].tiles_position;
    const virtualGrid: (Grid & null)[] = insertCatsTilesPositionsInGridHelper(level);

    return { tiles_position, virtualGrid }
}