import { Tile } from './Tile'
import { Grid } from './Grid'
import { GatInBox } from './GatInBox'

export type DomainGlobalState = {
    virtualGrid: (Grid & null)[25],
    level: number | null,
    gatsInBixes: GatInBox[],
    movements: number,
    tiles_position: [Tile, Tile, Tile, Tile] | undefined,
}