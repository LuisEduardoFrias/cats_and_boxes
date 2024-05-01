import { Tile } from './tile'
import { Gat } from './gat'
import { Piece } from './piece'
import { Grid } from './geid'
import { Lever } from './lever'

export type GlobalState = {
    edited_grids: number[],
    grid: Grid[25],
    gats_position: [Gat, Gat, Gat, Gat, Gat],
    lever: number,
    levers: any,//Lever
    pieces: Piece,
    tiles_position: [Tile, Tile, Tile, Tile],
    tile_seleted: undefined,
    viewLevers: boolean,
    viewPlay: boolean,
    viewSetting: boolean
}