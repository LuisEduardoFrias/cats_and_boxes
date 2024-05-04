import { Lever } from './Lever'

export type InterfaceGlobalState = {
    tile_seleted: undefined,
    levers: Lever[],
    edited_grids: number[],
    viewLevers: boolean,
    viewPlay: boolean,
    viewSetting: boolean
}