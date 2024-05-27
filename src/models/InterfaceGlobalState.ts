import { Lever } from './Lever'
import { Tile } from './Tile'
import { Sound } from './Tile'

export type InterfaceGlobalState = {
    tile_seleted: Tile | undefined,
    old_tile_seleted: Tile | undefined,
    levers: Lever[],
    shadow_in_grid: number[],
    boxChangeImg: [],//tile index img
    confetti: boolean,
    menuGame: boolean,
    release: boolean,
    sound: Sound,
    music: Sound,
    levelsView: boolean,
    playView: boolean,
    settingView: boolean
}