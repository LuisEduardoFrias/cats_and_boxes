import { Tile } from './Tile'
import { Grid } from './Grid'
import { CatInBox } from './CatInBox'

export type DomainGlobalState = {
    virtualGrid: (Grid & null)[25],
    level: number | null,
    catsInBoxes: CatInBox[],
    movements: number,
    tiles_position: [Tile, Tile, Tile, Tile] | undefined,
}