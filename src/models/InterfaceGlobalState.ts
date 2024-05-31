import { Level } from './Level'
import { Tile } from './Tile'
import { Sound } from './Tile'
import type { selectAll } from "./SelectAll"

export type InterfaceGlobalState = {
    tile_seleted: Tile | undefined,
    old_tile_seleted: Tile | undefined,
    levels: Level[],
    shadow_in_grid: number[],
    boxChangeImg: [],//tile index img
    confetti: boolean,
    menuGame: boolean,
    release: boolean,
    sound: Sound,
    music: Sound,
    levelsView: boolean,
    playView: boolean,
    settingView: boolean,
    tutorialView: boolean,
    selectAll: selectAll,
}