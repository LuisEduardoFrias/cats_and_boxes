import { Tile } from './tile'
import { Gat } from './gat'
import { Piece } from './piece'
import { Grid } from './geid'
import { Lever } from './lever'

export type GlobalState = {
    viewLevers: boolean,
    viewSetting: boolean,
    viewPlay: boolean,
    lever: number;
    levers: any;//Lever
    pieces: Piece;
    tiles_position: [Tile, Tile, Tile, Tile];
    gats_position: [Gat, Gat, Gat, Gat, Gat];
    tile_seleted: undefined,
    edited_grids: number[],
    grid: Grid[25],
}