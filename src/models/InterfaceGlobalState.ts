import { Lever } from './Lever'
import { Tile } from './Tile'

export type InterfaceGlobalState = {
    tile_seleted: Tile | undefined,
    old_tile_seleted: Tile | undefined,
    levers: Lever[],
    edited_grids: number[],
    confetti: boolean,
    menuGame: boolean,
    release: boolean,
    viewLevers: boolean,
    viewPlay: boolean,
    viewSetting: boolean,
}