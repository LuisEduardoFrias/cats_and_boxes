import { Tile } from './Tile'
import { Grid } from './Grid'

export type DomainGlobalState = {
    grid: (Grid & null)[25],
    lever: number | null,
    gatsInBixes:number, 
    movements:number,
    tiles_position: [Tile, Tile, Tile, Tile] | undefined,
}